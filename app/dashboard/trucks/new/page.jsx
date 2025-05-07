"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, TruckIcon, FileText, Gauge, PenToolIcon as Tool } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// Equipment types
const equipmentTypes = [
  { value: "dry_van", label: "Dry Van" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "flatbed", label: "Flatbed" },
  { value: "step_deck", label: "Step Deck" },
  { value: "lowboy", label: "Lowboy" },
  { value: "tanker", label: "Tanker" },
  { value: "sprinter_van", label: "Sprinter Van" },
  { value: "box_truck", label: "Box Truck" },
]

// Truck makes
const truckMakes = [
  { value: "freightliner", label: "Freightliner" },
  { value: "peterbilt", label: "Peterbilt" },
  { value: "kenworth", label: "Kenworth" },
  { value: "volvo", label: "Volvo" },
  { value: "mack", label: "Mack" },
  { value: "international", label: "International" },
  { value: "western_star", label: "Western Star" },
  { value: "ford", label: "Ford" },
  { value: "ram", label: "RAM" },
  { value: "hino", label: "Hino" },
  { value: "other", label: "Other" },
]

// Form schema
const formSchema = z.object({
  // Step 1: Basic Information
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z
    .string()
    .min(4, { message: "Year must be 4 digits" })
    .max(4, { message: "Year must be 4 digits" })
    .regex(/^\d{4}$/, { message: "Year must be a valid 4-digit year" }),
  vin: z.string().min(17, { message: "VIN must be 17 characters" }).max(17, { message: "VIN must be 17 characters" }),
  licensePlate: z.string().min(1, { message: "License plate is required" }),
  state: z.string().min(1, { message: "State is required" }),
  equipmentType: z.string().min(1, { message: "Equipment type is required" }),
  color: z.string().optional(),

  // Step 2: Specifications
  engineType: z.string().optional(),
  transmission: z.string().optional(),
  horsepower: z.string().optional(),
  torque: z.string().optional(),
  fuelType: z.string().min(1, { message: "Fuel type is required" }),
  fuelCapacity: z.string().optional(),
  currentMileage: z.string().min(1, { message: "Current mileage is required" }),
  axleConfiguration: z.string().optional(),
  gvwr: z.string().optional(), // Gross Vehicle Weight Rating
  sleeper: z.boolean().default(false),
  sleeperSize: z.string().optional(),

  // Step 3: Registration & Insurance
  registrationExpiry: z.date({ required_error: "Registration expiry date is required" }),
  insuranceProvider: z.string().min(1, { message: "Insurance provider is required" }),
  insurancePolicyNumber: z.string().min(1, { message: "Insurance policy number is required" }),
  insuranceExpiry: z.date({ required_error: "Insurance expiry date is required" }),
  dotNumber: z.string().optional(),
  annualInspectionDate: z.date().optional(),

  // Step 4: Maintenance
  lastMaintenanceDate: z.date().optional(),
  nextMaintenanceDate: z.date().optional(),
  nextMaintenanceMileage: z.string().optional(),
  maintenanceProvider: z.string().optional(),
  maintenanceNotes: z.string().optional(),
  status: z.enum(["available", "in_transit", "maintenance", "out_of_service"]).default("available"),
  purchaseDate: z.date().optional(),
  purchasePrice: z.string().optional(),
  notes: z.string().optional(),
})

// Form schema type
export default function NewTruckPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values
  const form = useForm({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      vin: "",
      licensePlate: "",
      state: "",
      equipmentType: "",
      color: "",
      engineType: "",
      transmission: "",
      horsepower: "",
      torque: "",
      fuelType: "diesel",
      fuelCapacity: "",
      currentMileage: "",
      axleConfiguration: "",
      gvwr: "",
      sleeper: false,
      sleeperSize: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      dotNumber: "",
      maintenanceProvider: "",
      maintenanceNotes: "",
      status: "available",
      purchasePrice: "",
      notes: "",
    },
  })

  // Get form values for preview
  const formValues = form.watch()

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      // In a real application, you would send this data to your API
      console.log("Form submitted:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to trucks page after successful submission
      router.push("/dashboard/trucks?success=true")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigate to next step
  const nextStep = async () => {
    let fieldsToValidate = []

    // Determine which fields to validate based on current step
    switch (step) {
      case 1:
        fieldsToValidate = ["make", "model", "year", "vin", "licensePlate", "state", "equipmentType"]
        break
      case 2:
        fieldsToValidate = ["fuelType", "currentMileage"]
        break
      case 3:
        fieldsToValidate = ["registrationExpiry", "insuranceProvider", "insurancePolicyNumber", "insuranceExpiry"]
        break
      case 4:
        // No required fields in step 4
        break
    }

    // Validate the fields for the current step
    const result = await form.trigger(fieldsToValidate)

    if (result) {
      setStep((prev) => Math.min(prev + 1, 5))
    }
  }

  // Go back to previous step
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Add New Truck</h1>
        <p className="text-muted-foreground">Register a new truck to your fleet</p>
      </div>

      <div className="mb-8">
        <Tabs value={String(step)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="1" onClick={() => step > 1 && setStep(1)}>
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="2" onClick={() => step > 2 && setStep(2)}>
              Specifications
            </TabsTrigger>
            <TabsTrigger value="3" onClick={() => step > 3 && setStep(3)}>
              Registration
            </TabsTrigger>
            <TabsTrigger value="4" onClick={() => step > 4 && setStep(4)}>
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="5" onClick={() => step > 5 && setStep(5)}>
              Review
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the truck's basic details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select make" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {truckMakes.map((make) => (
                                  <SelectItem key={make.value} value={make.value}>
                                    {make.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Cascadia" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. White" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="equipmentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Equipment Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select equipment type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {equipmentTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="vin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VIN</FormLabel>
                            <FormControl>
                              <Input placeholder="17-character VIN" {...field} />
                            </FormControl>
                            <FormDescription>Vehicle Identification Number</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="licensePlate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>License Plate</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. ABC1234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. TX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" disabled>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 2: Specifications */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                    <CardDescription>Enter the truck's technical specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="engineType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Engine Type</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Cummins X15" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="transmission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transmission</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Eaton Fuller 10-speed" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="horsepower"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horsepower</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 500" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="torque"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Torque (lb-ft)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 1850" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fuel Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fuel type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="gasoline">Gasoline</SelectItem>
                                <SelectItem value="cng">CNG</SelectItem>
                                <SelectItem value="lng">LNG</SelectItem>
                                <SelectItem value="electric">Electric</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fuelCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fuel Capacity (gal)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 150" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentMileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Mileage</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 50000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="axleConfiguration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Axle Configuration</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 6x4" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gvwr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GVWR (lbs)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 80000" {...field} />
                            </FormControl>
                            <FormDescription>Gross Vehicle Weight Rating</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="sleeper"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Sleeper Cab</FormLabel>
                              <FormDescription>Does this truck have a sleeper?</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("sleeper") && (
                        <FormField
                          control={form.control}
                          name="sleeperSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sleeper Size</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 72 inch" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 3: Registration & Insurance */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Registration & Insurance</CardTitle>
                    <CardDescription>Enter registration and insurance details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="registrationExpiry"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Registration Expiry Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dotNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DOT Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 12345678" {...field} />
                            </FormControl>
                            <FormDescription>Department of Transportation Number</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="insuranceProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Progressive Commercial" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="insurancePolicyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Policy Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. POL-12345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="insuranceExpiry"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Insurance Expiry Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="annualInspectionDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Annual Inspection Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 4: Maintenance */}
              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance & Status</CardTitle>
                    <CardDescription>Enter maintenance information and current status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="lastMaintenanceDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Last Maintenance Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nextMaintenanceDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Next Maintenance Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="nextMaintenanceMileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Next Maintenance Mileage</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 60000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maintenanceProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maintenance Provider</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Freightliner Service Center" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="maintenanceNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maintenance Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any maintenance notes or history"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="in_transit">In Transit</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="out_of_service">Out of Service</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purchaseDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Purchase Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="purchasePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Price (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 150000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any additional notes about this truck"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Review
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 5: Review and Submit */}
              {step === 5 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Truck Details</CardTitle>
                    <CardDescription>Please review all details before adding the truck</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Basic Information</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Make & Model</p>
                          <p className="font-medium">
                            {truckMakes.find((make) => make.value === formValues.make)?.label || formValues.make}{" "}
                            {formValues.model}
                          </p>
                          <p className="text-sm">{formValues.year}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Equipment Type</p>
                          <p className="font-medium">
                            {equipmentTypes.find((type) => type.value === formValues.equipmentType)?.label ||
                              formValues.equipmentType}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">VIN</p>
                          <p className="font-medium">{formValues.vin}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                          <p className="font-medium">
                            {formValues.licensePlate} ({formValues.state})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Specifications</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Engine</p>
                          <p className="font-medium">{formValues.engineType || "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Transmission</p>
                          <p className="font-medium">{formValues.transmission || "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fuel Type</p>
                          <p className="font-medium">{formValues.fuelType}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Current Mileage</p>
                          <p className="font-medium">{formValues.currentMileage} miles</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Sleeper</p>
                          <p className="font-medium">
                            {formValues.sleeper ? `Yes (${formValues.sleeperSize || "size not specified"})` : "No"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">GVWR</p>
                          <p className="font-medium">{formValues.gvwr ? `${formValues.gvwr} lbs` : "Not specified"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Registration & Insurance</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Registration Expiry</p>
                          <p className="font-medium">
                            {formValues.registrationExpiry ? format(formValues.registrationExpiry, "PPP") : "Not set"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">DOT Number</p>
                          <p className="font-medium">{formValues.dotNumber || "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                          <p className="font-medium">{formValues.insuranceProvider}</p>
                          <p className="text-sm">Policy: {formValues.insurancePolicyNumber}</p>
                          <p className="text-sm">
                            Expires:{" "}
                            {formValues.insuranceExpiry ? format(formValues.insuranceExpiry, "PPP") : "Not set"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Annual Inspection</p>
                          <p className="font-medium">
                            {formValues.annualInspectionDate
                              ? format(formValues.annualInspectionDate, "PPP")
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Tool className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Maintenance & Status</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                          <p className="font-medium">
                            {formValues.status.charAt(0).toUpperCase() + formValues.status.slice(1).replace("_", " ")}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Last Maintenance</p>
                          <p className="font-medium">
                            {formValues.lastMaintenanceDate
                              ? format(formValues.lastMaintenanceDate, "PPP")
                              : "Not specified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Next Maintenance</p>
                          <p className="font-medium">
                            {formValues.nextMaintenanceDate
                              ? format(formValues.nextMaintenanceDate, "PPP")
                              : "Not specified"}
                          </p>
                          {formValues.nextMaintenanceMileage && (
                            <p className="text-sm">or at {formValues.nextMaintenanceMileage} miles</p>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Purchase Information</p>
                          <p className="font-medium">
                            {formValues.purchaseDate ? format(formValues.purchaseDate, "PPP") : "Date not specified"}
                          </p>
                          {formValues.purchasePrice && <p className="text-sm">${formValues.purchasePrice}</p>}
                        </div>
                      </div>

                      {formValues.maintenanceNotes && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground">Maintenance Notes</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm">{formValues.maintenanceNotes}</p>
                        </div>
                      )}

                      {formValues.notes && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm">{formValues.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Truck...
                        </>
                      ) : (
                        "Add Truck"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </form>
          </Form>
        </div>

        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Tips for Adding Trucks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Accurate Information</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure all vehicle identification information is accurate, especially the VIN and license plate.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Maintenance Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Set up proper maintenance schedules to keep your fleet in optimal condition and avoid breakdowns.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Keep all registration and insurance documents up to date to avoid compliance issues.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Specifications</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed specifications help with load matching and maintenance planning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
