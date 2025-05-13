import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  FileText,
  MapPin,
  Package,
  Printer,
  Share2,
  Thermometer,
  Truck,
} from "lucide-react"
import PocketBase from 'pocketbase'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add type for params
interface PageParams {
  params: {
    id: string;
  };
}

// Setup Pocketbase connection
const getLoadDetails = async (id: string): Promise<Load> => {
  try {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090');
    
    const record = await pb.collection('loads').getOne(id, {
      expand: 'trackingEvents',
    });

    // Map the PocketBase record to the Load interface
    const load: Load = {
      id: record.id,
      reference_number: record.reference_number,
      status: record.status as LoadStatus,
      created: record.created,
      origin: record.origin,
      destination: record.destination,
      amount: record.amount,
      dateString: record.dateString,
      pickupDate: record.pickupDate,
      deliveryDate: record.deliveryDate,
      distance: record.distance,
      customer: record.customer,
      driver: record.driver,
      vehicle: record.vehicle,
      assignedAt: record.assignedAt,
      cargo_description: record.cargo_description,
      weight: record.weight,
      length: record.length,
      width: record.width,
      height: record.height,
      pieceCount: record.pieceCount,
      packagingType: record.packagingType,
      isHazardous: record.isHazardous,
      isExpedited: record.isExpedited,
      temperatureMin: record.temperatureMin,
      temperatureMax: record.temperatureMax,
      specialRequirements: record.specialRequirements,
      paymentStatus: record.paymentStatus,
      paymentAmount: record.paymentAmount,
      currency: record.currency,
      equipment_type: record.equipment_type,
      accessorialServices: record.accessorialServices,
      notes: record.notes,
      trackingEvents: record.expand?.trackingEvents || [],
    };
    
    return load;
  } catch (error) {
    console.error("Error fetching load details:", error);
    throw new Error(`Failed to fetch load details for ID: ${id}`);
  }
}

export type LoadStatus = "draft" | "pending" | "in-transit" | "delivered" | "delayed" | "cancelled";

export type TrackingEvent = {
  timestamp: string;
  status: string;
  location: string;
  notes?: string;
};

export interface Load {
  id: string;
  reference_number: string;
  status: LoadStatus;
  created: string;
  origin: string;
  destination: string;
  amount: number;
  dateString: string;
  pickupDate: string;
  deliveryDate: string;
  distance?: number;
  customer?: string;
  driver?: string;
  vehicle?: string;
  assignedAt?: string;
  cargo_description?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  pieceCount?: number;
  packagingType?: string;
  isHazardous?: boolean;
  isExpedited?: boolean;
  temperatureMin?: number | null;
  temperatureMax?: number | null;
  specialRequirements?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  currency?: string;
  equipment_type?: string;
  accessorialServices?: string;
  notes?: string;
  trackingEvents?: TrackingEvent[];
}

export default async function LoadDetailsPage({ params }: PageParams) {
  const load = await getLoadDetails(params.id);

  const statusColors = {
    draft: "bg-gray-500",
    pending: "bg-blue-500",
    "in-transit": "bg-amber-500",
    delivered: "bg-green-500",
    delayed: "bg-red-500",
    cancelled: "bg-red-700",
  }

  const statusLabels = {
    draft: "Draft",
    pending: "Pending",
    "in-transit": "In Transit",
    delivered: "Delivered",
    delayed: "Delayed",
    cancelled: "Cancelled",
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: load.currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Handle tracking events - could be a relation field in Pocketbase or stored differently
  // This is a fallback if tracking events aren't available in the record
  const trackingEvents = load.trackingEvents || [
    {
      timestamp: load.pickupDate,
      status: "Picked Up",
      location: load.origin,
      notes: "Load picked up",
    }
  ];

  const paymentStatus = load.paymentStatus || "Pending";
  const paymentAmount = load.paymentAmount || 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/dashboard/tracking">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to tracking</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Load {load.reference_number}
            <Badge 
              variant={load.status === "delayed" ? "destructive" : "default"}
              className="capitalize ml-2"
            >
              <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColors[load.status] || "bg-gray-500"}`} />
              {statusLabels[load.status] || load.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground">Created on {formatDate(load.created)}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Load
          </Button>
        </div>
      </div>

      <div className="p-4 grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Load Summary</CardTitle>
              <CardDescription>Overview of load details and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Route Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium">Origin</div>
                          <div>{load.origin}</div>
                          <div className="text-sm text-muted-foreground">Pickup: {formatDate(load.pickupDate)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-2.5">
                        <div className="h-10 w-0.5 bg-muted" />
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{load.distance} km</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium">Destination</div>
                          <div>{load.destination}</div>
                          <div className="text-sm text-muted-foreground">Delivery: {formatDate(load.deliveryDate)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Assignment</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Customer:</span>
                        <span className="font-medium">{load.customer || "Not assigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Driver:</span>
                        <span className="font-medium">{load.driver || "Not assigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Vehicle:</span>
                        <span className="font-medium">{load.vehicle || "Not assigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Assigned:</span>
                        <span>{formatDate(load.assignedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Cargo Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Description:</span>
                        <span className="font-medium text-right">{load.cargo_description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Weight:</span>
                        <span>{load.weight} tonnes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Dimensions:</span>
                        <span>
                          {load.length} × {load.width} × {load.height} cm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Piece Count:</span>
                        <span>{load.pieceCount} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Packaging:</span>
                        <span>{load.packagingType}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Special Requirements</h3>
                    <div className="space-y-2">
                      {load.isHazardous && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Hazardous Materials</span>
                        </div>
                      )}
                      {load.isExpedited && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Expedited Delivery</span>
                        </div>
                      )}
                      {load.temperatureMin !== null && load.temperatureMax !== null && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-sm">
                            Temperature Control: {load.temperatureMin}°C to {load.temperatureMax}°C
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5" />
                        <span className="text-sm">{load.specialRequirements}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Amount:</span>
                        <span className="font-medium">{formatCurrency(paymentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        {/* @ts-ignore */}
                        <Badge variant={paymentStatus === "Paid" ? "default" : "secondary"}>
                          {paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment & Services Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Equipment & Services</CardTitle>
              <CardDescription>Details about equipment and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Equipment</h3>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <Truck className="h-10 w-10" />
                  <div>
                    <div className="font-medium">{load.equipment_type}</div>
                    <div className="text-sm text-muted-foreground">
                      {load.length} × {load.width} × {load.height} cm
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Accessorial Services</h3>
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="text-sm">{load.accessorialServices}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="text-sm">{load.notes || "No additional notes"}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tracking Timeline</CardTitle>
            <CardDescription>Real-time tracking updates for this load</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline">
              <TabsList className="mb-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-0">
                <div className="relative pl-6 pb-6">
                    {/* @ts-ignore */}
                  {trackingEvents.map((event, index) => (
                    <div key={index} className="relative mb-8 last:mb-0">
                      {/* Timeline connector */}
                      {index < trackingEvents.length - 1 && (
                        <div className="absolute top-2 left-[-24px] h-full w-0.5 bg-muted"></div>
                      )}

                      {/* Event dot */}
                      <div className="absolute top-2 left-[-28px] h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>

                      {/* Event content */}
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h4 className="font-medium">{event.status}</h4>
                          <time className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</time>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        {event.notes && <p className="text-sm text-muted-foreground mt-2">{event.notes}</p>}
                      </div>
                    </div>
                  ))}

                  {/* Expected delivery */}
                  <div className="relative mt-4">
                    <div className="absolute top-2 left-[-28px] h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg border border-dashed">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <h4 className="font-medium text-muted-foreground">Expected Delivery</h4>
                        <time className="text-sm text-muted-foreground">{formatDate(load.deliveryDate)}</time>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{load.destination}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="map">
                <div className="relative w-full h-[400px] bg-muted/30 flex items-center justify-center rounded-md">
                  <div className="text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive map would be displayed here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing route from {load.origin} to {load.destination}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Bill of Lading</div>
                        <div className="text-sm text-muted-foreground">PDF, 245 KB</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Commercial Invoice</div>
                        <div className="text-sm text-muted-foreground">PDF, 198 KB</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Customs Declaration</div>
                        <div className="text-sm text-muted-foreground">PDF, 312 KB</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}