"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Settings,
  MapPin,
  Calendar,
  TruckIcon,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import pb from "@/lib/pocketbase";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const editDriverSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  is_available: z.boolean(),
  current_location: z.string().min(1, "Current location is required"),
  status: z.enum(["active", "inactive", "on_duty", "off_duty"]),
});

type EditDriverForm = z.infer<typeof editDriverSchema>;

interface Driver {
  id: string;
  driver_id: string;
  profile_photo: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  licence_number: string;
  license_expiry: string;
  years_experience: string;
  driver_type: string;
  is_available: boolean;
  current_location: string;
  status: "active" | "on_duty" | "off_duty" | "inactive";
  created: string;
  updated: string;
}

// Status badge color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "on_duty":
      return "bg-blue-500";
    case "off_duty":
      return "bg-slate-500";
    case "inactive":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Format status for display
const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const form = useForm<EditDriverForm>({
    resolver: zodResolver(editDriverSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      address: "",
      is_available: false,
      current_location: "",
      status: "active",
    },
  });

  const onOpenEditDialog = (driver: Driver) => {
    setSelectedDriver(driver);
    form.reset({
      full_name: driver.full_name,
      phone: driver.phone,
      address: driver.address,
      is_available: driver.is_available,
      current_location: driver.current_location,
      status: driver.status,
    });
    setIsEditDialogOpen(true);
  };

  const onSubmit = async (data: EditDriverForm) => {
    try {
      if (selectedDriver) {
        await pb.collection("drivers").update(selectedDriver.id, data);
        setIsEditDialogOpen(false);
        const updatedDrivers = drivers.map((d) =>
          d.id === selectedDriver.id ? { ...d, ...data } : d
        );
        setDrivers(updatedDrivers);
      }
    } catch (error) {
      console.error("Error updating driver:", error);
    }
  };

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const records = await pb.collection("drivers").getFullList<Driver>({
          sort: "-created",
        });
        setDrivers(records);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  // Filter drivers based on search term and filters
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.driver_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.current_location
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "all" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <span className="text-lg">Loading drivers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl text-[#1b858f]">
            Driver Management
          </h1>
          <Link href="/carrier-dashboard/drivers/new">
            <Button className="bg-[#1b858f] cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, location, or contact info"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_duty">On Duty</SelectItem>
              <SelectItem value="off_duty">Off Duty</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrivers.length === 0 ? (
              <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">
                  No drivers match your search criteria
                </p>
              </div>
            ) : (
              filteredDrivers.map((driver) => (
                <Card key={driver.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="mb-4 flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {driver.full_name}
                          </h3>
                          <Badge
                            className={` ${getStatusColor(
                              driver.status
                            )} border-2 border-background`}
                          >
                            {formatStatus(driver.status)}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {driver.driver_id}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{driver.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{driver.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{driver.current_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />                          <span>
                            {driver.licence_number} (Expires:{" "}
                            {new Date(driver.license_expiry).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }).replace(/(\d+) (\w+) (\d+)/, '[$1 - $2 - $3]')})
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />                          <span className="text-xs text-muted-foreground">
                            Joined {new Date(driver.created).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }).replace(/(\d+) (\w+) (\d+)/, '[$1 - $2 - $3]')}
                          </span>
                        </div>                          <Button variant="outline" size="sm" onClick={() => onOpenEditDialog(driver)}>
                          <Settings className="mr-1 h-3 w-3" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Driver</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Contact</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left font-medium">License</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No drivers match your search criteria
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={driver.profile_photo || "/placeholder.svg"}
                              alt={driver.full_name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">
                                {driver.full_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {driver.driver_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(driver.status)}>
                            {formatStatus(driver.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div>{driver.phone}</div>
                            <div className="text-xs text-muted-foreground">
                              {driver.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{driver.current_location}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div>{driver.licence_number}</div>                            <div className="text-xs text-muted-foreground">
                              Exp: {new Date(driver.license_expiry).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }).replace(/(\d+) (\w+) (\d+)/, '[$1 - $2 - $3]')}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Settings</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Driver Details</DialogTitle>
            <DialogDescription>
              Update the driver's information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Current location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on_duty">On Duty</SelectItem>
                        <SelectItem value="off_duty">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        Is the driver available for assignments?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
