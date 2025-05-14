"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Control } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, ChevronRight, Loader2, MapPin, Package, DollarSign, Info } from "lucide-react"
import pb from "@/lib/pocketbase"

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
import { Checkbox } from "@/components/ui/checkbox"
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

// Time slots
const timeSlots = [
  { value: "00:00-04:00", label: "12:00 AM - 4:00 AM" },
  { value: "04:00-08:00", label: "4:00 AM - 8:00 AM" },
  { value: "08:00-12:00", label: "8:00 AM - 12:00 PM" },
  { value: "12:00-16:00", label: "12:00 PM - 4:00 PM" },
  { value: "16:00-20:00", label: "4:00 PM - 8:00 PM" },
  { value: "20:00-00:00", label: "8:00 PM - 12:00 AM" },
  { value: "flexible", label: "Flexible" },
]

// Form schema
const formSchema = z.object({
  // Step 1: Route Information
  origin: z.string().min(3, { message: "Origin location is required" }),
  originAddress: z.string().min(3, { message: "Origin address is required" }),
  destination: z.string().min(3, { message: "Destination location is required" }),
  destinationAddress: z.string().min(3, { message: "Destination address is required" }),
  pickupDate: z.date({ required_error: "Pickup date is required" }),
  pickupTime: z.string({ required_error: "Pickup time is required" }),
  deliveryDate: z.date({ required_error: "Delivery date is required" }),
  deliveryTime: z.string({ required_error: "Delivery time is required" }),

  // Step 2: Load Details
  cargo_description: z.string().min(2, { message: "Cargo description is required" }),
  isHazardous: z.boolean().default(false),
  isExpedited: z.boolean().default(false),
  weight: z.string().min(1, { message: "Weight is required" }),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  equipment_type: z.string({ required_error: "Equipment type is required" }),
  pieceCount: z.string().optional(),
  packagingType: z.string().optional(),
  temperatureMin: z.string().optional(),
  temperatureMax: z.string().optional(),
  
  // Step 3: Rate and Requirements
  distance: z.string().optional(),
  specialRequirements: z.string().optional(),
  accessorialServices: z.string().optional(),

  // Step 4: Company Information
  companyName: z.string().min(2, { message: "Company name is required" }),
  reference_number: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "cancelled"]).default("draft"),
  visibility: z.enum(["public", "private"]).default("public"),
})


// Check is user is authenicated
if (!pb.authStore.isValid) {
  console.log("User is not authenticated");
  // Optionally redirect to login or show an error
} else {
  console.log("User is authenticated", pb.authStore.model?.id);
}

type FormValues = z.infer<typeof formSchema>

export default function NewLoadPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      origin: "",
      originAddress: "",
      destination: "",
      destinationAddress: "",
      pickupTime: "",
      deliveryTime: "",
      cargo_description: "",
      isHazardous: false,
      isExpedited: false,
      weight: "",
      length: "",
      width: "",
      height: "",
      equipment_type: "",
      pieceCount: "",
      packagingType: "",
      temperatureMin: "",
      temperatureMax: "",
      distance: "",
      specialRequirements: "",
      accessorialServices: "",
      companyName: "",
      reference_number: "",
      status: "draft",
      visibility: "public",
    },
  })
  // Get form values for preview
  const formValues = form.watch()
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Format the data according to PocketBase schema
      const formattedData = {
        reference_number: data.reference_number || generateReferenceNumber(),
        status: "draft",
        visibility: data.visibility,
        isHazardous: data.isHazardous || false,
        isExpedited: data.isExpedited || false,
        assignedAt: null,
        completedAt: null,
        cargo_description: data.cargo_description,
        weight: data.weight ? parseFloat(data.weight) : null,
        length: data.length ? parseFloat(data.length) : null,
        width: data.width ? parseFloat(data.width) : null,
        height: data.height ? parseFloat(data.height) : null,
        pieceCount: data.pieceCount ? parseInt(data.pieceCount) : null,
        packagingType: data.packagingType || null,
        specialRequirements: data.specialRequirements || null,
        accessorialServices: data.accessorialServices || null,
        temperatureMin: data.temperatureMin ? parseFloat(data.temperatureMin) : null,
        temperatureMax: data.temperatureMax ? parseFloat(data.temperatureMax) : null,
        equipment_type: data.equipment_type,
        origin: data.origin,
        origin_address: data.originAddress,
        destination: data.destination,
        destination_address: data.destinationAddress,
        pickup_date: data.pickupDate ? new Date(data.pickupDate).toISOString().split('T')[0] : null,
        pickup_time: data.pickupTime || null,
        delivery_date: data.deliveryDate ? new Date(data.deliveryDate).toISOString().split('T')[0] : null,
        delivery_time: data.deliveryTime || null,
        distance: data.distance ? parseFloat(data.distance) : null,
        company_name: data.companyName,
      };

      // Create the record in PocketBase
      await pb.collection('loads').create(formattedData);
      
      // Redirect to loads page after successful submission
      router.push("/dashboard/loads?success=true");
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Failed to create load. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to generate a reference number
  const generateReferenceNumber = () => {
    return `LD-${Date.now().toString().slice(-6)}`;
  };

  // Navigate to next step
  const nextStep = async () => {
    let fieldsToValidate: string[] = []

    // Determine which fields to validate based on current step
    switch (step) {
      case 1:
        fieldsToValidate = [
          "origin",
          "originAddress",
          "destination",
          "destinationAddress",
          "pickupDate",
          "pickupTime",
          "deliveryDate",
          "deliveryTime",
        ]
        break
      case 2:
        fieldsToValidate = [
          "cargo_description", 
          "weight", 
          "equipment_type",
        ]
        break
      case 3:
        fieldsToValidate = ["companyName"]
        break
    }

    // Validate the fields for the current step
    const result = await form.trigger(fieldsToValidate as any)

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
        <h1 className="text-2xl font-bold md:text-3xl">Post a New Load</h1>
        <p className="text-muted-foreground">Create a new load listing for carriers to view and book</p>
      </div>

      <div className="mb-8">
        <Tabs value={String(step)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="1" onClick={() => step > 1 && setStep(1)}>
              Route
            </TabsTrigger>
            <TabsTrigger value="2" onClick={() => step > 2 && setStep(2)}>
              Cargo
            </TabsTrigger>
            <TabsTrigger value="3" onClick={() => step > 3 && setStep(3)}>
              Company
            </TabsTrigger>
            <TabsTrigger value="4" onClick={() => step > 4 && setStep(4)}>
              Review
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 1: Route Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Route Information</CardTitle>
                    <CardDescription>Enter pickup and delivery details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <FormField
                          control={form.control as unknown as Control<FormValues>}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin City/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Johannesburg, GP" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control as unknown as Control<FormValues>}
                          name="originAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Street address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control as unknown as Control<FormValues>}
                            name="pickupDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Pickup Date</FormLabel>
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
                            control={form.control as unknown as Control<FormValues>}
                            name="pickupTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pickup Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {timeSlots.map((slot) => (
                                      <SelectItem key={slot.value} value={slot.value}>
                                        {slot.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control as unknown as Control<FormValues>}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Destination City/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Mahikeng, NW" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control as unknown as Control<FormValues>}
                          name="destinationAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Destination Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Street address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control as unknown as Control<FormValues>}
                            name="deliveryDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Delivery Date</FormLabel>
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
                                      disabled={(date) =>
                                        date < new Date() ||
                                        (form.getValues("pickupDate") && date < form.getValues("pickupDate"))
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control as unknown as Control<FormValues>}
                            name="deliveryTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {timeSlots.map((slot) => (
                                      <SelectItem key={slot.value} value={slot.value}>
                                        {slot.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" disabled>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 2: Load Details */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cargo Details</CardTitle>
                    <CardDescription>Describe the cargo and equipment requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="cargo_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo Description</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Packaged goods, Pallets, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="isHazardous"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Hazardous Cargo</FormLabel>
                              <FormDescription>
                                Check this box if the cargo contains hazardous materials
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kgs)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g. 15000" {...field} />
                            </FormControl>
                            <FormDescription>Total weight in killograms</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length (in)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g. 48" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width (in)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g. 40" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (in)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g. 48" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control as unknown as Control<FormValues>}
                      name="equipment_type"
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
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 4: Company Information */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Provide company details for this load</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as unknown as Control<FormValues>}
                        name="reference_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reference Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Internal reference number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control as unknown as Control<FormValues>}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visibility</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Public loads are visible to all carriers, private loads are only visible to invited carriers
                          </FormDescription>
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
                      Review <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 5: Review and Submit */}
              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Load</CardTitle>
                    <CardDescription>Please review all details before posting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Route Information</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Origin</p>
                          <p className="font-medium">{formValues.origin}</p>
                          <p className="text-sm">{formValues.originAddress}</p>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {formValues.pickupDate ? format(formValues.pickupDate, "MMM d, yyyy") : "Not set"}
                            </span>
                            <span className="text-muted-foreground">|</span>
                            <span>
                              {timeSlots.find((slot) => slot.value === formValues.pickupTime)?.label || "Not set"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Destination</p>
                          <p className="font-medium">{formValues.destination}</p>
                          <p className="text-sm">{formValues.destinationAddress}</p>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {formValues.deliveryDate ? format(formValues.deliveryDate, "MMM d, yyyy") : "Not set"}
                            </span>
                            <span className="text-muted-foreground">|</span>
                            <span>
                              {timeSlots.find((slot) => slot.value === formValues.deliveryTime)?.label || "Not set"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Cargo Details</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Cargo Description</p>
                          <p>{formValues.cargo_description || "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Hazardous Cargo</p>
                          <p>{formValues.isHazardous ? "Yes" : "No"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Weight</p>
                          <p>{formValues.weight ? `${formValues.weight} kgs` : "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
                          <p>
                            {formValues.length || formValues.width || formValues.height
                              ? `${formValues.length || "-"} × ${formValues.width || "-"} × ${formValues.height || "-"} in`
                              : "Not specified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Equipment Type</p>
                          <p>
                            {equipmentTypes.find((type) => type.value === formValues.equipment_type)?.label ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                   

                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Company Information</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Company</p>
                          <p>{formValues.companyName || "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                          <p>{formValues.reference_number || "None"}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Visibility</p>
                          <p>{formValues.visibility === "public" ? "Public" : "Private"}</p>
                        </div>
                      </div>
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
                          Posting Load...
                        </>
                      ) : (
                        "Post Load"
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
              <CardTitle>Tips for Posting Loads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Accurate Information</h3>
                <p className="text-sm text-muted-foreground">
                  Provide precise pickup and delivery locations to help carriers plan their routes efficiently.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Detailed Cargo Description</h3>
                <p className="text-sm text-muted-foreground">
                  Include accurate weight, dimensions, and any special handling requirements.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Competitive Rates</h3>
                <p className="text-sm text-muted-foreground">
                  Research current market rates to ensure your load is attractive to carriers.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Flexible Pickup/Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  When possible, offer flexible time windows to increase the chances of finding a carrier.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}