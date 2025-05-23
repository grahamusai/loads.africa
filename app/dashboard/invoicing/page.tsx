import Link from "next/link"
import {
  AlertCircle,
  Calendar,
  Check,
  CreditCard,
  Download,
  Eye,
  Filter,
  FileText,
  MoreHorizontal,
  Printer,
  Receipt,
  Search,
  Send,
  Truck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Sample data for invoicing dashboard
const invoices = [
  {
    id: "INV-2025-001",
    loadId: "LDN-2305-KGL",
    customer: "EastAfrica Distributors",
    origin: "Lagos, Nigeria",
    destination: "Kigali, Rwanda",
    issueDate: "2025-05-07",
    dueDate: "2025-05-21",
    amount: 4850000,
    currency: "ZAR",
    status: "pending",
    paymentMethod: null,
    items: [
      { description: "Freight Charges", amount: 3200000 },
      { description: "Customs Clearance", amount: 850000 },
      { description: "Insurance", amount: 450000 },
      { description: "Loading/Unloading", amount: 150000 },
      { description: "Documentation", amount: 200000 },
    ],
    taxes: [{ description: "VAT (7.5%)", amount: 363750 }],
    notes: "Payment due within 14 days of invoice date. Late payments subject to 2% monthly interest.",
  },
  {
    id: "INV-2025-002",
    loadId: "NBO-4721-CPT",
    customer: "Southern Trade Co.",
    origin: "Nairobi, Kenya",
    destination: "Cape Town, South Africa",
    issueDate: "2025-05-11",
    dueDate: "2025-05-25",
    amount: 580000,
    currency: "ZAR",
    status: "pending",
    paymentMethod: null,
    items: [
      { description: "Freight Charges", amount: 420000 },
      { description: "Customs Clearance", amount: 85000 },
      { description: "Insurance", amount: 45000 },
      { description: "Loading/Unloading", amount: 15000 },
      { description: "Documentation", amount: 15000 },
    ],
    taxes: [{ description: "VAT (16%)", amount: 92800 }],
    notes: "Payment due within 14 days of invoice date. Late payments subject to 2% monthly interest.",
  },
  {
    id: "INV-2025-003",
    loadId: "ACC-1834-ADD",
    customer: "East African Imports",
    origin: "Accra, Ghana",
    destination: "Addis Ababa, Ethiopia",
    issueDate: "2025-05-03",
    dueDate: "2025-05-17",
    amount: 68500,
    currency: "ZAR",
    status: "paid",
    paymentMethod: "Bank Transfer",
    paymentDate: "2025-05-15",
    transactionId: "TRX-78945612",
    items: [
      { description: "Freight Charges", amount: 45000 },
      { description: "Customs Clearance", amount: 12000 },
      { description: "Insurance", amount: 6500 },
      { description: "Loading/Unloading", amount: 2500 },
      { description: "Documentation", amount: 2500 },
    ],
    taxes: [{ description: "VAT (12.5%)", amount: 8562.5 }],
    notes: "Payment received. Thank you for your business.",
  },
  {
    id: "INV-2025-004",
    loadId: "JHB-9273-DAR",
    customer: "Tanzania Retail Group",
    origin: "Johannesburg, South Africa",
    destination: "Dar es Salaam, Tanzania",
    issueDate: "2025-04-29",
    dueDate: "2025-05-13",
    amount: 85000,
    currency: "ZAR",
    status: "overdue",
    paymentMethod: null,
    items: [
      { description: "Freight Charges", amount: 58000 },
      { description: "Customs Clearance", amount: 15000 },
      { description: "Insurance", amount: 7000 },
      { description: "Loading/Unloading", amount: 2500 },
      { description: "Documentation", amount: 2500 },
    ],
    taxes: [{ description: "VAT (15%)", amount: 12750 }],
    notes: "OVERDUE: Please make payment immediately to avoid service interruption.",
  },
  {
    id: "INV-2025-005",
    loadId: "CAI-5629-CAS",
    customer: "North Africa Trading",
    origin: "Cairo, Egypt",
    destination: "Casablanca, Morocco",
    issueDate: "2025-05-05",
    dueDate: "2025-05-19",
    amount: 125000,
    currency: "ZAR",
    status: "pending",
    paymentMethod: null,
    items: [
      { description: "Freight Charges", amount: 85000 },
      { description: "Customs Clearance", amount: 20000 },
      { description: "Insurance", amount: 10000 },
      { description: "Loading/Unloading", amount: 5000 },
      { description: "Documentation", amount: 5000 },
    ],
    taxes: [{ description: "VAT (14%)", amount: 17500 }],
    notes: "Payment due within 14 days of invoice date. Late payments subject to 2% monthly interest.",
  },
]

export default function InvoicingPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Invoicing</h1>
          <p className="text-muted-foreground">Manage and track invoices for all shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <div className="p-4 grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Filters</CardTitle>
              <CardDescription>Refine your invoice list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Payment Status</div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Due Date</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-week">Due This Week</SelectItem>
                    <SelectItem value="next-week">Due Next Week</SelectItem>
                    <SelectItem value="this-month">Due This Month</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Amount Range</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Min" min="0" />
                  <Input type="number" placeholder="Max" min="0" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Currency</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                    <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                    <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                    <SelectItem value="GHS">Ghanaian Cedi (GHS)</SelectItem>
                    <SelectItem value="EGP">Egyptian Pound (EGP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Customer</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="eastafrica">EastAfrica Distributors</SelectItem>
                    <SelectItem value="southern">Southern Trade Co.</SelectItem>
                    <SelectItem value="eastafrican">East African Imports</SelectItem>
                    <SelectItem value="tanzania">Tanzania Retail Group</SelectItem>
                    <SelectItem value="northafrica">North Africa Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Outstanding</span>
                <span className="font-medium">$5,555,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <span className="font-medium text-red-500">$85,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Due This Week</span>
                <span className="font-medium">$4,850,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Paid This Month</span>
                <span className="font-medium text-green-500">$68,500</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search by invoice #, load ID, or customer..." className="pl-8 w-full" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="dueDate">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="issueDate">Issue Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface InvoiceCardProps {
  invoice: any
}

function InvoiceCard({ invoice }: InvoiceCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-blue-500",
    paid: "bg-green-500",
    overdue: "bg-red-500",
    cancelled: "bg-gray-500",
  }

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    overdue: "Overdue",
    cancelled: "Cancelled",
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      NGN: "$",
      KES: "$",
      ZAR: "R",
      GHS: "$",
      EGP: "$",
    }

    return `${currencySymbols[currency] || ""}${amount.toLocaleString()}`
  }

  const calculateTotal = () => {
    const itemsTotal = invoice.items.reduce((sum: number, item: any) => sum + item.amount, 0)
    const taxesTotal = invoice.taxes.reduce((sum: number, tax: any) => sum + tax.amount, 0)
    return itemsTotal + taxesTotal
  }

  const isDueSoon = () => {
    const today = new Date()
    const dueDate = new Date(invoice.dueDate)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0 && invoice.status === "pending"
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{invoice.id}</h3>
                <Badge
                // @ts-ignore
                  variant={
                    invoice.status === "overdue" ? "destructive" : invoice.status === "paid" ? "success" : "outline"
                  }
                  className="capitalize"
                >
                  <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColors[invoice.status]}`} />
                  {statusLabels[invoice.status]}
                </Badge>
                {isDueSoon() && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Due Soon
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                <span>
                  Load:{" "}
                  <Link href={`/dashboard/loads/${invoice.loadId}`} className="hover:underline">
                    {invoice.loadId}
                  </Link>
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Invoice</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Invoice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download Invoice</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Invoice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Printer className="h-4 w-4" />
                      <span className="sr-only">Print Invoice</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Print Invoice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Email Invoice</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email Invoice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Invoice Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {invoice.status !== "paid" && (
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Record Payment</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    <span>Send Reminder</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Edit Invoice</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>Void Invoice</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {invoice.status === "pending" && (
                <Button size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Customer</div>
              <div className="font-medium">{invoice.customer}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Route</div>
              <div className="font-medium">
                {invoice.origin} → {invoice.destination}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Issue Date</div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className={invoice.status === "overdue" ? "text-red-500 font-medium" : ""}>
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-md p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <h4 className="font-medium mb-2 md:mb-0">Invoice Items</h4>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Total Amount:</span>
                <span className="ml-2 font-bold text-lg">{formatCurrency(invoice.amount, invoice.currency)}</span>
              </div>
            </div>

            <div className="space-y-2">
              {invoice.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.description}</span>
                  <span>{formatCurrency(item.amount, invoice.currency)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              {invoice.taxes.map((tax: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{tax.description}</span>
                  <span>{formatCurrency(tax.amount, invoice.currency)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal(), invoice.currency)}</span>
              </div>
            </div>
          </div>

          {invoice.status === "paid" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="h-4 w-4" />
                <span className="font-medium">Payment Received</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-green-700">
                <div>
                  <span className="text-green-600">Date: </span>
                  <span>{formatDate(invoice.paymentDate)}</span>
                </div>
                <div>
                  <span className="text-green-600">Method: </span>
                  <span>{invoice.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-green-600">Transaction ID: </span>
                  <span>{invoice.transactionId}</span>
                </div>
              </div>
            </div>
          )}

          {invoice.notes && (
            <div className="mt-4 text-sm">
              <span className="font-medium">Notes: </span>
              <span className={invoice.status === "overdue" ? "text-red-500" : "text-muted-foreground"}>
                {invoice.notes}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
