import Link from "next/link";
import {
  ArrowUpDown,
  Calendar,
  Filter,
  Loader2,
  MapPin,
  Package,
  Search,
  Truck,
  Weight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TrackingPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-[#1b858f]">Load Tracking</h1>
          <p className="text-muted-foreground">
            Monitor and track your shipments across Africa
          </p>
        </div>
       
      </div>

      <div className="p-4 grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Filters</CardTitle>
              <CardDescription>Refine your load search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Loads</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Origin</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos, Nigeria</SelectItem>
                    <SelectItem value="nairobi">Nairobi, Kenya</SelectItem>
                    <SelectItem value="accra">Accra, Ghana</SelectItem>
                    <SelectItem value="johannesburg">
                      Johannesburg, South Africa
                    </SelectItem>
                    <SelectItem value="cairo">Cairo, Egypt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Destination</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addis-ababa">
                      Addis Ababa, Ethiopia
                    </SelectItem>
                    <SelectItem value="dar-es-salaam">
                      Dar es Salaam, Tanzania
                    </SelectItem>
                    <SelectItem value="kigali">Kigali, Rwanda</SelectItem>
                    <SelectItem value="cape-town">
                      Cape Town, South Africa
                    </SelectItem>
                    <SelectItem value="casablanca">
                      Casablanca, Morocco
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Load Type</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select load type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="consumer-goods">
                      Consumer Goods
                    </SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="perishable">Perishable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Weight Range (Tonnes)</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Min" min="0" />
                  <Input type="number" placeholder="Max" min="0" />
                </div>
              </div>

              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Loads
                </span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  In Transit
                </span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Delivered Today
                </span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Delayed</span>
                <span className="font-medium text-red-500">3</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, destination, or customer..."
                className="pl-8 w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="newest">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="weight-asc">
                    Weight (Low to High)
                  </SelectItem>
                  <SelectItem value="weight-desc">
                    Weight (High to Low)
                  </SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="list" className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="map">Map</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsContent value="list" className="m-0">
              <div className="space-y-4">
                <LoadCard
                  id="LDN-2305-KGL"
                  origin="Lagos, Nigeria"
                  destination="Kigali, Rwanda"
                  status="in-transit"
                  weight="12.5"
                  distance="3,450"
                  customer="EastAfrica Distributors"
                  pickupDate="2025-05-06"
                  deliveryDate="2025-05-12"
                  type="Consumer Goods"
                />

                <LoadCard
                  id="NBO-4721-CPT"
                  origin="Nairobi, Kenya"
                  destination="Cape Town, South Africa"
                  status="available"
                  weight="18.2"
                  distance="4,200"
                  customer="Southern Trade Co."
                  pickupDate="2025-05-10"
                  deliveryDate="2025-05-18"
                  type="Agricultural"
                />

                <LoadCard
                  id="ACC-1834-ADD"
                  origin="Accra, Ghana"
                  destination="Addis Ababa, Ethiopia"
                  status="delayed"
                  weight="8.7"
                  distance="4,800"
                  customer="East African Imports"
                  pickupDate="2025-05-02"
                  deliveryDate="2025-05-09"
                  type="Industrial"
                />

                <LoadCard
                  id="JHB-9273-DAR"
                  origin="Johannesburg, South Africa"
                  destination="Dar es Salaam, Tanzania"
                  status="delivered"
                  weight="15.3"
                  distance="3,100"
                  customer="Tanzania Retail Group"
                  pickupDate="2025-04-28"
                  deliveryDate="2025-05-04"
                  type="Construction"
                />

                <LoadCard
                  id="CAI-5629-CAS"
                  origin="Cairo, Egypt"
                  destination="Casablanca, Morocco"
                  status="in-transit"
                  weight="10.8"
                  distance="3,900"
                  customer="North Africa Trading"
                  pickupDate="2025-05-04"
                  deliveryDate="2025-05-11"
                  type="Consumer Goods"
                />
              </div>
            </TabsContent>

            <TabsContent value="map" className="m-0">
              <Card>
                <CardContent className="p-0">
                  <div className="relative w-full h-[600px] bg-muted/30 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Loading map view...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Displaying 24 loads across Africa
                      </p>
                    </div>
                    {/* Map would be implemented here with a proper mapping library */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface LoadCardProps {
  id: string;
  origin: string;
  destination: string;
  status: "available" | "in-transit" | "delivered" | "delayed";
  weight: string;
  distance: string;
  customer: string;
  pickupDate: string;
  deliveryDate: string;
  type: string;
}

function LoadCard({
  id,
  origin,
  destination,
  status,
  weight,
  distance,
  customer,
  pickupDate,
  deliveryDate,
  type,
}: LoadCardProps) {
  const statusColors = {
    available: "bg-blue-500",
    "in-transit": "bg-amber-500",
    delivered: "bg-green-500",
    delayed: "bg-red-500",
  };

  const statusLabels = {
    available: "Available",
    "in-transit": "In Transit",
    delivered: "Delivered",
    delayed: "Delayed",
  };

  const formattedPickupDate = new Date(pickupDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedDeliveryDate = new Date(deliveryDate).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{id}</h3>
                <Badge
                  variant={status === "delayed" ? "destructive" : "outline"}
                  className="capitalize"
                >
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full ${statusColors[status]}`}
                  />
                  {statusLabels[status]}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">{customer}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/loads/${id}`}>View Details</Link>
              </Button>
              <Button size="sm">Track Load</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Origin</div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="font-medium">{origin}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="font-medium">{destination}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Pickup Date</div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formattedPickupDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Delivery Date</div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formattedDeliveryDate}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Load Type</div>
              <div className="flex items-center gap-1.5">
                <Package className="h-4 w-4" />
                <span>{type}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Weight</div>
              <div className="flex items-center gap-1.5">
                <Weight className="h-4 w-4" />
                <span>{weight} tonnes</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Distance</div>
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4" />
                <span>{distance} km</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
