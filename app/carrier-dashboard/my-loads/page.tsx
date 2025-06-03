"use client"

import { useState } from "react"
import pb from "@/lib/pocketbase"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Settings, MapPin, Package, Search, Truck, TruckIcon, Weight, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"

// Define the Load type
interface Load {
  id: string;
  reference_number: string;
  status: 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled';
  visibility: string;
  currency: string;
  distance: number;
  isHazardous: boolean;
  isExpedited: boolean;
  assignedAt: string;
  completedAt: string;
  cargo_description: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  pieceCount: number;
  packagingType: string;
  specialRequirements: string;
  accessorialServices: string;
  temperatureMin: number;
  temperatureMax: number;
  equipment_type: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  cargo_name: string;
  paymentAmount: number;
  carrier: string;
  documents: string[];
  current_location?: string;
  driver_name?: string;
  created: string;
  updated: string;
}

// Define fetcher function to fetch loads from PocketBase
interface Load {
  id: string
  status: 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled'
  current_location?: string
  driver_name?: string
  origin: string
  destination: string
  pickupDate: string
  pickupTime: string
  deliveryDate: string
  deliveryTime: string
  equipment_type: string
  weight: number
  distance: number
  cargo_name: string
  company: string
  rate: string
}

const fetcher = async (): Promise<Load[]> => {
  // Get the current user's ID
  const userId = pb.authStore.model?.id
  if (!userId) {
    throw new Error("User not authenticated")
  }
  
  // Fetch loads where the carrier field matches the current user's ID
  const records = await pb.collection('loads').getList(1, 50, {
    sort: '-created',
    filter: `carrier = "${userId}"`,
  })
  return records.items as unknown as Load[]
}

// Status badge color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-500"
    case "pending":
      return "bg-yellow-500"
    case "in_transit":
      return "bg-green-500"
    case "completed":
      return "bg-purple-500"
    case "cancelled":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export default function LoadsPage() {
  const router = useRouter()
  const { data: loads, error, mutate } = useSWR<Load[]>("/loads", fetcher)

  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: "",
    current_location: "",
    driver_name: ""
  })
  const handleUpdateLoad = async () => {
    if (!selectedLoad) return

    try {
      const updateData = {
        status: updateForm.status,
        current_location: updateForm.current_location || null,
        driver_name: updateForm.driver_name || null,
        updated: new Date().toISOString()
      }
      await pb.collection('loads').update(selectedLoad.id, updateData)
      setIsUpdateDialogOpen(false)
      mutate() // Refresh the loads data
    } catch (error) {
      console.error("Error updating load:", error)
    }
  }

  const handleManageLoad = (load: Load) => {
    setSelectedLoad(load)
    setUpdateForm({
      status: load.status,
      current_location: load.current_location || "",
      driver_name: load.driver_name || ""
    })
    setIsUpdateDialogOpen(true)
  }

  if (error) {
    console.error("Error fetching loads:", error)
    return <div>Error loading data</div>
  }

  // Display all loads assigned to the carrier (no filtering by status)
  const displayedLoads = loads || []

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [equipmentFilter, setEquipmentFilter] = useState("all")

  return (
    <div className="container mx-auto p-4 md:p-6 ">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-[#1b858f] font-bold md:text-3xl">My Loads</h1>
            <p className="text-muted-foreground">View and manage loads assigned to you</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, location, or company"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>              <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              <SelectItem value="Dry Van">Dry Van</SelectItem>
              <SelectItem value="Refrigerated">Refrigerated</SelectItem>
              <SelectItem value="Flatbed">Flatbed</SelectItem>
              <SelectItem value="Sprinter Van">Sprinter Van</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {displayedLoads.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No loads match your search criteria</p>
            </div>
          ) : (
            displayedLoads.map((load) => (
              <Card key={load.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    {/* Status indicator */}
                    <div className={`${getStatusColor(load.status)} hidden w-2 md:block`}></div>

                    {/* Load details */}
                    <div className="p-4 md:col-span-11 md:grid md:grid-cols-12 md:gap-4">
                      <div className="mb-4 flex items-center justify-between md:col-span-12 md:mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{load.id}</h3>
                          <Badge className={getStatusColor(load.status)}>
                            {load.status.charAt(0).toUpperCase() + load.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-green-600">{load.rate}</div>
                      </div>

                      <div className="md:col-span-5">
                        <div className="mb-4 flex items-start gap-2">
                          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">Pickup</div>
                            <div>{load.origin}</div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{load.pickupDate}</span>
                              <Clock className="ml-1 h-3.5 w-3.5" />
                              <span>{load.pickupTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Delivery</div>
                            <div>{load.destination}</div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{load.deliveryDate}</span>
                              <Clock className="ml-1 h-3.5 w-3.5" />
                              <span>{load.deliveryTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:col-span-4 md:mt-0">
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>{load.equipment_type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-muted-foreground" />
                            <span>{load.weight} kg</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span>{load.distance} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{load.cargo_name}</span>
                          </div>
                        </div>
                      </div>                      <div className="mt-4 flex items-center justify-between md:col-span-3 md:mt-0 md:flex-col md:items-end md:justify-start">
                        <div className="text-sm text-muted-foreground">{load.company}</div>
                        <Button onClick={() => handleManageLoad(load)} className="mt-2 bg-[#1b858f] rounded-full">
                          <Settings className="mr-2" /> Manage Load
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}        </TabsContent>

        <TabsContent value="map">
          <div className="flex h-[500px] items-center justify-center rounded-lg border">
            <div className="text-center">
              <TruckIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">Map View Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                We're working on an interactive map to visualize load routes.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>      {/* Update Load Dialog */}
      {selectedLoad && (
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Load</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select
                  value={updateForm.status}
                  onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="current_location" className="text-sm font-medium">Current Location</label>
                <Input
                  id="current_location"
                  placeholder="Current location"
                  value={updateForm.current_location}
                  onChange={(e) => setUpdateForm({ ...updateForm, current_location: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="driver_name" className="text-sm font-medium">Driver Name</label>
                <Input
                  id="driver_name"
                  placeholder="Driver's name"
                  value={updateForm.driver_name}
                  onChange={(e) => setUpdateForm({ ...updateForm, driver_name: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateLoad} className="bg-[#1b858f]">Update Load</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
