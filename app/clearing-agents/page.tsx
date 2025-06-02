'use client'
import Link from "next/link"
import { useState, useEffect } from "react"
import { AlertCircle, Check, ChevronDown, Clock, FileCheck, FileText, Filter, MapPin, Search, X } from "lucide-react"
import pb from "../../lib/pocketbase"
import { RecordModel } from 'pocketbase'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Loads data will be fetched from Pocketbase collection

interface LoadDocument {
  id: string;
  name: string;
  required: boolean;
  submittedAt?: string;
  notes?: string;
  status: 'approved' | 'pending' | 'rejected' | 'not-submitted' | 'not-required';
}

interface Load extends RecordModel {
  id: string;
  customer: string;
  clearanceStatus: 'pending' | 'in-progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  origin: string;
  destination: string;
  currentLocation: string;
  documents: LoadDocument[];
  notes?: string;
}

export default function ClearingAgentPage() {
  const [loads, setLoads] = useState<Load[]>([])

useEffect(() => {
  const fetchLoads = async () => {
    const response = await pb.collection('pbc_3010141149').getFullList<Load>()
    setLoads(response)
  }
  fetchLoads()
}, [])
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Customs Clearance</h1>
          <p className="text-muted-foreground">
            Manage document submissions and customs clearance for cross-border shipments
          </p>
        </div>
        <Button>
          <FileCheck className="mr-2 h-4 w-4" />
          Process New Clearance
        </Button>
      </div>

      <div className="p-4 grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Filters</CardTitle>
              <CardDescription>Refine your clearance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Clearance Status</div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Border Crossing</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select border" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Borders</SelectItem>
                    <SelectItem value="nigeria-benin">Nigeria-Benin</SelectItem>
                    <SelectItem value="kenya-tanzania">Kenya-Tanzania</SelectItem>
                    <SelectItem value="zambia-zimbabwe">Zambia-Zimbabwe</SelectItem>
                    <SelectItem value="south-africa-zimbabwe">South Africa-Zimbabwe</SelectItem>
                    <SelectItem value="egypt-libya">Egypt-Libya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Document Status</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="missing-documents">Missing Documents</SelectItem>
                    <SelectItem value="rejected-documents">Rejected Documents</SelectItem>
                    <SelectItem value="pending-approval">Pending Approval</SelectItem>
                    <SelectItem value="fully-approved">Fully Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Priority</div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="priority-high" />
                  <label
                    htmlFor="priority-high"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    High
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="priority-medium" />
                  <label
                    htmlFor="priority-medium"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Medium
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="priority-low" />
                  <label
                    htmlFor="priority-low"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Low
                  </label>
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
                <span className="text-sm text-muted-foreground">Pending Clearance</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Delayed</span>
                <span className="font-medium text-red-500">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed Today</span>
                <span className="font-medium text-green-500">5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search by ID, customer, or location..." className="pl-8 w-full" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="priority">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                  <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                  <SelectItem value="status">Clearance Status</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="space-y-4">
            {loads.map((load) => (
              <ClearanceCard key={load.id} load={load} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ClearanceCardProps {
  load: Load
}

function ClearanceCard({ load }: ClearanceCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-blue-500",
    "in-progress": "bg-amber-500",
    completed: "bg-green-500",
    delayed: "bg-red-500",
  }

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
    delayed: "Delayed",
  }

  const priorityColors: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
  }

  const documentStatusColors: Record<string, string> = {
    approved: "text-green-500",
    pending: "text-amber-500",
    rejected: "text-red-500",
    "not-submitted": "text-muted-foreground",
    "not-required": "text-muted-foreground",
  }

  const documentStatusIcons: Record<string, any> = {
    approved: <Check className="h-4 w-4 text-green-500" />,
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    rejected: <X className="h-4 w-4 text-red-500" />,
    "not-submitted": <AlertCircle className="h-4 w-4 text-muted-foreground" />,
    "not-required": <FileText className="h-4 w-4 text-muted-foreground" />,
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const pendingDocuments = load.documents.filter(
    (doc: any) => status === "pending" || status === "not-submitted" || status === "rejected",
  ).length

  const approvedDocuments = load.documents.filter((doc: any) => status === "approved").length

  const totalRequiredDocuments = load.documents.filter((doc: any) => doc.required).length

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{load.id}</h3>
                <Badge variant={load.clearanceStatus === "delayed" ? "destructive" : "outline"} className="capitalize">
                  <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColors[load.clearanceStatus]}`} />
                  {statusLabels[load.clearanceStatus]}
                </Badge>
                {/* <Badge variant="outline" className="ml-1">
                  <span className={`mr-1.5 h-2 w-2 rounded-full ${priorityColors[load.priority]}`} />
                  {load.priority.charAt(0).toUpperCase() + load.priority.slice(1)} Priority
                </Badge> */}
              </div>
              <p className="text-muted-foreground text-sm">{load.customer}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/loads/${load.id}`}>View Load</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    Actions
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Clearance Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileCheck className="mr-2 h-4 w-4" />
                    <span>Review Documents</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4" />
                    <span>Approve Clearance</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>Request Documents</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Generate Clearance Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Origin</div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="font-medium">{load.origin}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="font-medium">{load.destination}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Location</div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{load.currentLocation}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Document Status</div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>
                  {approvedDocuments}/{totalRequiredDocuments} Approved
                </span>
              </div>
            </div>
          </div>

          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Required Documents</span>
                {pendingDocuments > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingDocuments} Pending
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator />
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {load.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-start gap-3">
                      {documentStatusIcons[status]}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{doc.name}</span>
                          <Badge variant="outline" className={documentStatusColors[status]}>
                            {status === "not-submitted"
                              ? "Not Submitted"
                              : status === "not-required"
                                ? "Not Required"
                                : status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                        {doc.submittedAt && (
                          <p className="text-xs text-muted-foreground">Submitted: {formatDate(doc.submittedAt)}</p>
                        )}
                        {doc.notes && <p className="text-sm text-red-500 mt-1">{doc.notes}</p>}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Document</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Document</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {load.notes && (
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <p className="text-sm font-medium">Notes:</p>
              <p className="text-sm">{load.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
