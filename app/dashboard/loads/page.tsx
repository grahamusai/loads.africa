"use client"

import { useState } from "react"
import { Calendar, Clock, CirclePlus, MapPin, Package, Search, Truck, TruckIcon, Weight, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Mock data for loads
const loads = [
  {
    id: "L-1234",
    origin: "Lagos, Nigeria",
    destination: "Accra, Ghana",
    pickupDate: "2023-05-15",
    pickupTime: "08:00-12:00",
    deliveryDate: "2023-05-16",
    deliveryTime: "13:00-17:00",
    distance: "437 km",
    weight: "6,800 kg",
    equipment: "Dry Van",
    status: "in_transit",
    rate: "$2,800",
    company: "West African Logistics Ltd",
    contact: {
      name: "Kwame Mensah",
      phone: "+233 24 123 4567",
      email: "k.mensah@walnigeria.com"
    }
  },
  {
    id: "L-1235",
    origin: "Port Harcourt, Nigeria",
    destination: "Calabar, Nigeria",
    pickupDate: "2023-05-16",
    pickupTime: "07:00-10:00",
    deliveryDate: "2023-05-16",
    deliveryTime: "15:00-18:00",
    distance: "315 km",
    weight: "12,500 kg",
    equipment: "Flatbed",
    status: "assigned",
    rate: "$1,500",
    company: "Nigerian Port Authority",
    contact: {
      name: "Chinua Okonkwo",
      phone: "+234 802 345 6789",
      email: "c.okonkwo@npa.gov.ng"
    }
  },
  {
    id: "L-1236",
    origin: "Nairobi, Kenya",
    destination: "Mombasa, Kenya",
    pickupDate: "2023-05-17",
    pickupTime: "06:00-09:00",
    deliveryDate: "2023-05-17",
    deliveryTime: "16:00-19:00",
    distance: "485 km",
    weight: "8,200 kg",
    equipment: "Refrigerated",
    status: "pending",
    rate: "$2,200",
    company: "East African Fresh Foods",
    contact: {
      name: "Sarah Kimani",
      phone: "+254 722 123 456",
      email: "s.kimani@eaff.co.ke"
    }
  },
  {
    id: "L-1237",
    origin: "Cairo, Egypt",
    destination: "Alexandria, Egypt",
    pickupDate: "2023-05-18",
    pickupTime: "09:00-12:00",
    deliveryDate: "2023-05-18",
    deliveryTime: "15:00-18:00",
    distance: "221 km",
    weight: "15,000 kg",
    equipment: "Dry Van",
    status: "delivered",
    rate: "$1,200",
    company: "Mediterranean Shipping Co.",
    contact: {
      name: "Ahmed Hassan",
      phone: "+20 100 123 4567",
      email: "a.hassan@medship.eg"
    }
  },
  {
    id: "L-1238",
    origin: "Johannesburg, South Africa",
    destination: "Durban, South Africa",
    pickupDate: "2023-05-19",
    pickupTime: "07:00-11:00",
    deliveryDate: "2023-05-20",
    deliveryTime: "08:00-12:00",
    distance: "567 km",
    weight: "18,000 kg",
    equipment: "Container",
    status: "pending",
    rate: "$2,500",
    company: "South African Trade Co.",
    contact: {
      name: "Linda van der Merwe",
      phone: "+27 82 123 4567",
      email: "l.vandermerwe@satc.co.za"
    }
  },
  {
    id: "L-1239",
    origin: "Dar es Salaam, Tanzania",
    destination: "Dodoma, Tanzania",
    pickupDate: "2023-05-20",
    pickupTime: "08:00-11:00",
    deliveryDate: "2023-05-20",
    deliveryTime: "18:00-21:00",
    distance: "426 km",
    weight: "9,500 kg",
    equipment: "Flatbed",
    status: "pending",
    rate: "$1,800",
    company: "Tanzania Logistics Services",
    contact: {
      name: "James Mwakasege",
      phone: "+255 744 123 456",
      email: "j.mwakasege@tzlogistics.co.tz"
    }
  }
]

// Status badge color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "posted":
      return "bg-blue-500"
    case "assigned":
      return "bg-yellow-500"
    case "in transit":
      return "bg-green-500"
    case "delivered":
      return "bg-slate-500"
    default:
      return "bg-gray-500"
  }
}

export default function LoadsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [equipmentFilter, setEquipmentFilter] = useState("all")

  // Filter loads based on search term and filters
  const filteredLoads = loads.filter((load) => {
    const matchesSearch =
      load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || load.status === statusFilter
    const matchesEquipment = equipmentFilter === "all" || load.equipment === equipmentFilter

    return matchesSearch && matchesStatus && matchesEquipment
  })

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">Available Loads</h1>
          <Link href="/dashboard/loads/new" className="flex items-center justify-center rounded-md bg-[#1C2831] px-4 py-2 text-white hover:bg-black">
            <CirclePlus className="mr-2 h-4 w-4" />
            Create a Load
          </Link>
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
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
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
          {filteredLoads.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No loads match your search criteria</p>
            </div>
          ) : (
            filteredLoads.map((load) => (
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
                            <div className="font-medium">Pickup</div>
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
                            <span>{load.equipment}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-muted-foreground" />
                            <span>{load.weight}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span>{load.distance}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>cargo</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between md:col-span-3 md:mt-0 md:flex-col md:items-end md:justify-start">
                        <div className="text-sm text-muted-foreground">{load.company}</div>
                        <Button className="mt-2">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

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
      </Tabs>
    </div>
  )
}
