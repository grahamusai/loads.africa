"use client"

import { useState } from "react"
import getPocketBaseClient from "@/lib/pocketbase-client"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Calendar, Clock, CirclePlus, MapPin, Package, Search, Truck, TruckIcon, Weight, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Define fetcher function to fetch loads from PocketBase
const fetcher = async () => {
  const pb = getPocketBaseClient();
  if (!pb) {
    throw new Error("PocketBase client not initialized");
  }
  const records = await pb.collection('loads').getList(1, 50, {
    sort: '-created',
  })
  return records.items
}

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
  const router = useRouter()

  const { data: loads, error } = useSWR("/loads", fetcher)
  if (error) {
    console.error("Error fetching loads:", error)
    return <div>Error loading data</div>
  }

  // Filter for only posted loads and take the first 10
  const displayedLoads = (loads || [])
    .filter(load => load.status === "posted")
    .slice(0, 10)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [equipmentFilter, setEquipmentFilter] = useState("all")

  return (
    <div className="container mx-auto p-4 md:p-6 ">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-[#1b858f] font-bold md:text-3xl">Available Loads</h1>
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
                      </div>

                      <div className="mt-4 flex items-center justify-between md:col-span-3 md:mt-0 md:flex-col md:items-end md:justify-start">
                        <div className="text-sm text-muted-foreground">{load.company}</div>
                        <Link href={`/carrier-dashboard/loads/${load.id}`} className="cursor-pointer" >
                        <Button className="mt-2 bg-[#1b858f]">View Details</Button>
                        </Link>
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
