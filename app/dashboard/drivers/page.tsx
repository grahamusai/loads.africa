"use client"

import { useState } from "react"
import { Plus, Search, Settings, MapPin, Calendar, TruckIcon, FileText, Phone, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"

// Mock data for drivers
const drivers = [
  {
    id: "D-101",
    name: "Oluwaseun Adebayo",
    image: "/placeholder.svg",
    phone: "+234 801 234 5678",
    email: "oluwaseun.adebayo@example.com",
    status: "active",
    licenseType: "Class C Commercial",
    licenseExpiry: "2025-06-15",
    location: "Lagos, Nigeria",
    joinDate: "2020-03-12",
    hoursAvailable: 8,
    hoursWorked: 32,
    performance: {
      onTimeDelivery: 98,
      safetyScore: 95,
      milesThisMonth: 6840,
      totalMiles: 201000,
    },
    truck: {
      id: "T-1001",
      name: "Mercedes-Benz Actros",
      status: "available",
    },
    currentLoad: null,
    notes: "Experienced in cross-border routes. Has dangerous goods certification.",
  },
  {
    id: "D-102",
    name: "Aisha Diallo",
    image: "/placeholder.svg",
    phone: "+225 07 89 45 23",
    email: "aisha.diallo@example.com",
    status: "on_duty",
    licenseType: "Class C Commercial",
    licenseExpiry: "2024-11-30",
    location: "Abidjan, Côte d'Ivoire to Accra, Ghana",
    joinDate: "2019-07-22",
    hoursAvailable: 2,
    hoursWorked: 38,
    performance: {
      onTimeDelivery: 100,
      safetyScore: 98,
      milesThisMonth: 6100,
      totalMiles: 228000,
    },
    truck: {
      id: "T-1002",
      name: "Scania G-Series",
      status: "in_transit",
    },
    currentLoad: {
      id: "L-1234",
      origin: "Abidjan, Côte d'Ivoire",
      destination: "Accra, Ghana",
      deliveryDate: "2023-05-16",
    },
    notes: "Excellent driver with perfect safety record. Specializes in West African routes.",
  },
  {
    id: "D-103",
    name: "Themba Nkosi",
    image: "/placeholder.svg",
    phone: "+27 82 345 6789",
    email: "themba.nkosi@example.com",
    status: "off_duty",
    licenseType: "Code EC License",
    licenseExpiry: "2024-08-22",
    location: "Johannesburg, South Africa",
    joinDate: "2021-02-15",
    hoursAvailable: 10,
    hoursWorked: 0,
    performance: {
      onTimeDelivery: 94,
      safetyScore: 92,
      milesThisMonth: 4750,
      totalMiles: 125000,
    },
    truck: {
      id: "T-1004",
      name: "FAW JH6",
      status: "available",
    },
    currentLoad: null,
    notes: "Returning from leave on 05/20. Expert in Southern African routes.",
  },
  {
    id: "D-104",
    name: "Amara Okafor",
    image: "/placeholder.svg",
    phone: "+234 802 567 8901",
    email: "amara.okafor@example.com",
    status: "on_duty",
    licenseType: "Class C Commercial",
    licenseExpiry: "2025-03-18",
    location: "Port Harcourt to Calabar, Nigeria",
    joinDate: "2018-11-05",
    hoursAvailable: 4,
    hoursWorked: 36,
    performance: {
      onTimeDelivery: 97,
      safetyScore: 96,
      milesThisMonth: 6600,
      totalMiles: 346000,
    },
    truck: {
      id: "T-1005",
      name: "Sino Truck",
      status: "in_transit",
    },
    currentLoad: {
      id: "L-1235",
      origin: "Port Harcourt, Nigeria",
      destination: "Calabar, Nigeria",
      deliveryDate: "2023-05-16",
    },
    notes: "Team driver capable. Specialized in oil and gas logistics.",
  },
  {
    id: "D-105",
    name: "Mohamed Hassan",
    image: "/placeholder.svg",
    phone: "+20 101 234 5678",
    email: "mohamed.hassan@example.com",
    status: "inactive",
    licenseType: "Class C Commercial",
    licenseExpiry: "2023-12-10",
    location: "Cairo, Egypt",
    joinDate: "2019-05-20",
    hoursAvailable: 0,
    hoursWorked: 0,
    performance: {
      onTimeDelivery: 92,
      safetyScore: 88,
      milesThisMonth: 1930,
      totalMiles: 153000,
    },
    truck: null,
    currentLoad: null,
    notes: "On medical leave until 06/15. North African route specialist.",
  },
  {
    id: "D-106",
    name: "Grace Mwangi",
    image: "/placeholder.svg",
    phone: "+254 722 123 456",
    email: "grace.mwangi@example.com",
    status: "active",
    licenseType: "Class C Commercial",
    licenseExpiry: "2025-01-25",
    location: "Nairobi, Kenya",
    joinDate: "2022-01-10",
    hoursAvailable: 10,
    hoursWorked: 30,
    performance: {
      onTimeDelivery: 99,
      safetyScore: 97,
      milesThisMonth: 5800,
      totalMiles: 67000,
    },
    truck: {
      id: "T-1007",
      name: "Isuzu Giga",
      status: "available",
    },
    currentLoad: null,
    notes: "East African logistics specialist. Excellent track record in cross-border deliveries.",
  },
]

// Status badge color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "on_duty":
      return "bg-blue-500"
    case "off_duty":
      return "bg-slate-500"
    case "inactive":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

// Format status for display
const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter drivers based on search term and filters
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const matchesStatus = statusFilter === "all" || driver.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl text-[#003039]">Driver Management</h1>
          <Link href="/dashboard/drivers/new">
            <Button className="bg-[#003039] cursor-pointer" >
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
                <p className="text-muted-foreground">No drivers match your search criteria</p>
              </div>
            ) : (
              filteredDrivers.map((driver) => (
                <Card key={driver.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="relative">
                          <Image
                            src={driver.image || "/placeholder.svg"}
                            alt={driver.name}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                          <Badge
                            className={`absolute -bottom-1 right-0 ${getStatusColor(driver.status)} border-2 border-background`}
                          >
                            {formatStatus(driver.status)}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{driver.name}</h3>
                          <p className="text-sm text-muted-foreground">{driver.id}</p>
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
                          <span>{driver.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {driver.licenseType} (Expires: {driver.licenseExpiry})
                          </span>
                        </div>
                      </div>

                      {driver.status !== "inactive" && (
                        <div className="mb-4">
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span>Hours of Service</span>
                            <span>
                              {driver.hoursWorked}/{driver.hoursWorked + driver.hoursAvailable}
                            </span>
                          </div>
                          <Progress
                            value={(driver.hoursWorked / (driver.hoursWorked + driver.hoursAvailable)) * 100}
                            className="h-2"
                          />
                        </div>
                      )}

                      {driver.truck ? (
                        <div className="mb-4 rounded-md bg-blue-50 p-2 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                          <div className="flex items-center gap-1">
                            <TruckIcon className="h-4 w-4" />
                            <span className="font-medium">Assigned Truck:</span> {driver.truck.id}
                          </div>
                          <p className="mt-1">{driver.truck.name}</p>
                        </div>
                      ) : (
                        <div className="mb-4 rounded-md bg-muted p-2 text-sm">
                          <div className="flex items-center gap-1">
                            <TruckIcon className="h-4 w-4 text-muted-foreground" />
                            <span>No truck assigned</span>
                          </div>
                        </div>
                      )}

                      {driver.currentLoad && (
                        <div className="mb-4 rounded-md bg-amber-50 p-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Current Load:</span> {driver.currentLoad.id}
                          </div>
                          <p className="mt-1">
                            {driver.currentLoad.origin} to {driver.currentLoad.destination}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">On-Time Delivery</p>
                          <p className="font-medium">{driver.performance.onTimeDelivery}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Safety Score</p>
                          <p className="font-medium">{driver.performance.safetyScore}/100</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Miles This Month</p>
                          <p className="font-medium">{driver.performance.milesThisMonth.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Miles</p>
                          <p className="font-medium">{driver.performance.totalMiles.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Joined {driver.joinDate}</span>
                        </div>
                        <Button variant="outline" size="sm">
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
                    <th className="px-4 py-3 text-left font-medium">Location</th>
                    <th className="px-4 py-3 text-left font-medium">License</th>
                    <th className="px-4 py-3 text-left font-medium">Hours</th>
                    <th className="px-4 py-3 text-left font-medium">Truck</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No drivers match your search criteria
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={driver.image || "/placeholder.svg"}
                              alt={driver.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-xs text-muted-foreground">{driver.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(driver.status)}>{formatStatus(driver.status)}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div>{driver.phone}</div>
                            <div className="text-xs text-muted-foreground">{driver.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{driver.location}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div>{driver.licenseType}</div>
                            <div className="text-xs text-muted-foreground">Exp: {driver.licenseExpiry}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {driver.status !== "inactive" ? (
                            <div>
                              <div className="flex items-center justify-between text-xs">
                                <span>
                                  {driver.hoursWorked}/{driver.hoursWorked + driver.hoursAvailable}
                                </span>
                              </div>
                              <Progress
                                value={(driver.hoursWorked / (driver.hoursWorked + driver.hoursAvailable)) * 100}
                                className="h-1.5 w-16"
                              />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {driver.truck ? (
                            <div>
                              <div>{driver.truck.id}</div>
                              <div className="text-xs text-muted-foreground">{driver.truck.name}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
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
    </div>
  )
}
