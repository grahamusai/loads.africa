"use client"

import { useState } from "react"
import { Filter, Plus, Search, Settings, TruckIcon, User, MapPin, Calendar, AlertTriangle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

// Mock data for trucks
const trucks = [
  {
    id: "T-1001",
    name: "Mercedes-Benz Actros 3340",
    image: "/images/actros.jpg",
    year: 2021,
    make: "Mercedes-Benz",
    model: "Actros 3340",
    status: "available",
    equipmentType: "Dry Van",
    licensePlate: "LND-234-KJ",
    vin: "WDB9634031L985423",
    location: "Lagos, Nigeria",
    mileage: 125000,
    fuelLevel: 85,
    nextMaintenance: "2023-06-15",
    lastMaintenanceDate: "2023-03-15",
    maintenanceNotes: "Regular service completed. All systems operational.",
    driver: {
      id: "D-101",
      name: "Oluwaseun Adebayo",
      image: "/placeholder.svg",
      phone: "+234 801 234 5678"
    }
  },
  {
    id: "T-1002",
    name: "Scania G460",
    image: "/images/scania.jpg",
    year: 2020,
    make: "Scania",
    model: "G460",
    status: "in_transit",
    equipmentType: "Container",
    licensePlate: "GR-572-20",
    vin: "YS2G460A2MZ456789",
    location: "Tema to Accra, Ghana",
    mileage: 98000,
    fuelLevel: 65,
    nextMaintenance: "2023-07-01",
    lastMaintenanceDate: "2023-04-01",
    maintenanceNotes: "New brake pads installed",
    driver: {
      id: "D-102",
      name: "Aisha Diallo",
      image: "/placeholder.svg",
      phone: "+233 24 123 4567"
    },
    currentLoad: {
      id: "L-1234",
      origin: "Tema, Ghana",
      destination: "Accra, Ghana"
    }
  },
  {
    id: "T-1003",
    name: "FAW J6P",
    image: "/images/faw.jpg",
    year: 2022,
    make: "FAW",
    model: "J6P",
    status: "maintenance",
    equipmentType: "Flatbed",
    licensePlate: "KCB-789H",
    vin: "LFB1323BXNH102345",
    location: "Nairobi, Kenya",
    mileage: 75000,
    fuelLevel: 40,
    nextMaintenance: "2023-05-25",
    lastMaintenanceDate: "2023-02-25",
    maintenanceNotes: "Scheduled engine maintenance in progress",
    driver: null
  },
  {
    id: "T-1004",
    name: "Isuzu GigaMax",
    image: "/images/isuzu.jpg",
    year: 2021,
    make: "Isuzu",
    model: "GigaMax",
    status: "available",
    equipmentType: "Refrigerated",
    licensePlate: "T-567-DES",
    vin: "JALB4B14507123456",
    location: "Dar es Salaam, Tanzania",
    mileage: 85000,
    fuelLevel: 90,
    nextMaintenance: "2023-06-30",
    lastMaintenanceDate: "2023-03-30",
    maintenanceNotes: "Cooling system checked and optimized",
    driver: {
      id: "D-106",
      name: "Grace Mwangi",
      image: "/placeholder.svg",
      phone: "+255 744 123 456"
    }
  },
  {
    id: "T-1005",
    name: "MAN TGS 33.480",
    image: "/images/man.png",
    year: 2020,
    make: "MAN",
    model: "TGS 33.480",
    status: "in_transit",
    equipmentType: "Container",
    licensePlate: "JHB-456-GP",
    vin: "WMAH06ZZ5BW156789",
    location: "Johannesburg to Durban, South Africa",
    mileage: 145000,
    fuelLevel: 55,
    nextMaintenance: "2023-07-15",
    lastMaintenanceDate: "2023-04-15",
    maintenanceNotes: "All systems functioning normally",
    driver: {
      id: "D-103",
      name: "Themba Nkosi",
      image: "/placeholder.svg",
      phone: "+27 82 345 6789"
    },
    currentLoad: {
      id: "L-1238",
      origin: "Johannesburg, South Africa",
      destination: "Durban, South Africa"
    }
  },
  {
    id: "T-1006",
    name: "Sino Truck A7",
    image: "/images/sino.jpg",
    year: 2021,
    make: "Sino Truck",
    model: "A7",
    status: "available",
    equipmentType: "Dry Van",
    licensePlate: "CRO-789-AX",
    vin: "LST4B1G47MH789012",
    location: "Cairo, Egypt",
    mileage: 92000,
    fuelLevel: 75,
    nextMaintenance: "2023-06-20",
    lastMaintenanceDate: "2023-03-20",
    maintenanceNotes: "Regular maintenance completed",
    driver: {
      id: "D-105",
      name: "Mohamed Hassan",
      image: "/placeholder.svg",
      phone: "+20 101 234 5678"
    }
  }
]

// Status badge color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500"
    case "in_transit":
      return "bg-blue-500"
    case "maintenance":
      return "bg-yellow-500"
    case "out_of_service":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

// Driver status badge color mapping
const getDriverStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "on_duty":
      return "bg-blue-500"
    case "off_duty":
      return "bg-slate-500"
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

export default function TrucksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [equipmentFilter, setEquipmentFilter] = useState("all")

  // Filter trucks based on search term and filters
  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch =
      truck.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (truck.driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false)

    const matchesStatus = statusFilter === "all" || truck.status === statusFilter
    const matchesEquipment = equipmentFilter === "all" || truck.equipmentType === equipmentFilter

    return matchesSearch && matchesStatus && matchesEquipment
  })

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl text-[#003039]">Fleet Management</h1>
          <Link href="/dashboard/trucks/new">
            <Button className="bg-[#003039]">
              <Plus className="mr-2 h-4 w-4" />
              Add Truck
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, make, model, or driver"
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
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_service">Out of Service</SelectItem>
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
              <SelectItem value="Tanker">Tanker</SelectItem>
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
            {filteredTrucks.length === 0 ? (
              <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">No trucks match your search criteria</p>
              </div>
            ) : (
              filteredTrucks.map((truck) => (
                <Card key={truck.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={truck.image || "/images/placeholder.png"}
                        alt={truck.name}
                        width={400}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                      <Badge className={`absolute right-2 top-2 ${getStatusColor(truck.status)}`}>
                        {formatStatus(truck.status)}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{truck.name}</h3>
                        <span className="text-sm text-muted-foreground">{truck.id}</span>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Year:</span> {truck.year}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Make:</span> {truck.make}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Model:</span> {truck.model}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Equipment:</span> {truck.equipmentType}
                        </div>
                      </div>

                      <div className="mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{truck.location}</span>
                      </div>

                      {truck.driver ? (
                        <div className="mb-4 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted">
                            <Image
                              src={truck.driver.image || "/images/placeholder.png"}
                              alt={truck.driver.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{truck.driver.name}</div>
                            <div className="flex items-center gap-1">
                              {/* <Badge className={getDriverStatusColor(truck.driver.status)}>
                                {formatStatus(truck.driver.status)}
                              </Badge> */}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">No driver assigned</span>
                        </div>
                      )}

                      {truck.status === "maintenance" || truck.status === "out_of_service" ? (
                        <div className="mb-4 rounded-md bg-yellow-50 p-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Maintenance Note:</span>
                          </div>
                          <p className="mt-1">{truck.maintenanceNotes}</p>
                        </div>
                      ) : truck.currentLoad ? (
                        <div className="mb-4 rounded-md bg-blue-50 p-2 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                          <div className="flex items-center gap-1">
                            <TruckIcon className="h-4 w-4" />
                            <span className="font-medium">Current Load:</span> {truck.currentLoad.id}
                          </div>
                          <p className="mt-1">
                            {truck.currentLoad.origin} to {truck.currentLoad.destination}
                          </p>
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Next maintenance: {truck.nextMaintenance}
                          </span>
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
                    <th className="px-4 py-3 text-left font-medium">Truck</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Driver</th>
                    <th className="px-4 py-3 text-left font-medium">Location</th>
                    <th className="px-4 py-3 text-left font-medium">Equipment</th>
                    <th className="px-4 py-3 text-left font-medium">Mileage</th>
                    <th className="px-4 py-3 text-left font-medium">Next Maintenance</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrucks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No trucks match your search criteria
                      </td>
                    </tr>
                  ) : (
                    filteredTrucks.map((truck) => (
                      <tr key={truck.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={truck.image || "/images/placeholder.png"}
                              alt={truck.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{truck.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {truck.year} • {truck.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(truck.status)}>{formatStatus(truck.status)}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {truck.driver ? (
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-muted">
                                <Image
                                  src={truck.driver.image || "/images/placeholder.png"}
                                  alt={truck.driver.name}
                                  width={24}
                                  height={24}
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                              </div>
                              <span>{truck.driver.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3">{truck.location}</td>
                        <td className="px-4 py-3">{truck.equipmentType}</td>
                        <td className="px-4 py-3">{truck.mileage.toLocaleString()} mi</td>
                        <td className="px-4 py-3">{truck.nextMaintenance}</td>
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

