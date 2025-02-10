
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Search, PlusCircle, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { SalesPlan } from "@/types/sales";
import { useToast } from "@/hooks/use-toast";

const mockSalesPlans: SalesPlan[] = [
  {
    id: "1",
    timeframe: {
      startDate: "2024-01-01",
      endDate: "2024-12-31"
    },
    planType: "top-down",
    productHierarchy: {
      category: "Electronics",
      subcategory: "Smartphones",
      sku: "iPhone-15"
    },
    location: {
      region: "North America",
      city: "New York",
      warehouse: "NYC-01"
    },
    planningValues: {
      targetValue: 1000000,
      confidence: 0.8,
      notes: "Based on historical data and market analysis"
    },
    status: "draft",
    lastUpdated: "2024-03-15",
    createdBy: "John Doe"
  }
];

const productCategories = ["Electronics", "Fashion", "Home & Garden"];
const regions = ["North America", "Europe", "Asia Pacific"];
const statuses = ["draft", "submitted", "approved", "rejected"];
const channelTypes = ["B2B", "Wholesale", "Direct"];

// Add subcategories mapping
const subcategories = {
  "Electronics": ["Smartphones", "Laptops", "Tablets", "Accessories"],
  "Fashion": ["Men's Wear", "Women's Wear", "Children's Wear", "Accessories"],
  "Home & Garden": ["Furniture", "Decor", "Garden Tools", "Lighting"]
};

// Add cities mapping
const cities = {
  "North America": ["New York", "Los Angeles", "Toronto", "Chicago"],
  "Europe": ["London", "Paris", "Berlin", "Madrid"],
  "Asia Pacific": ["Tokyo", "Singapore", "Sydney", "Seoul"]
};

const warehouses = {
  "New York": ["NYC-01", "NYC-02"],
  "Los Angeles": ["LA-01", "LA-02"],
  "London": ["LDN-01", "LDN-02"],
  "Tokyo": ["TKY-01", "TKY-02"]
};

const SalesPlanning = () => {
  const [planType, setPlanType] = useState<"top-down" | "bottom-up">("top-down");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new sales plan
  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    category: "",
    subcategory: "",
    region: "",
    city: "",
    warehouse: "",
    channelType: "",
    accountName: "",
    targetValue: "",
    confidence: "",
    notes: ""
  });

  const handleFormChange = (field: string, value: string) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: value };
      
      // Reset dependent fields when parent field changes
      if (field === "category") {
        newState.subcategory = "";
      }
      if (field === "region") {
        newState.city = "";
        newState.warehouse = "";
      }
      if (field === "city") {
        newState.warehouse = "";
      }
      if (field === "channelType" && !["B2B", "Wholesale"].includes(value)) {
        newState.accountName = "";
      }
      
      return newState;
    });
  };

  const handleCreateSalesPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Sales plan created successfully",
    });
    setIsDialogOpen(false);
    setFormState({
      startDate: "",
      endDate: "",
      category: "",
      subcategory: "",
      region: "",
      city: "",
      warehouse: "",
      channelType: "",
      accountName: "",
      targetValue: "",
      confidence: "",
      notes: ""
    });
  };

  const filteredSalesPlans = mockSalesPlans.filter((plan) => {
    const matchesSearch = 
      plan.productHierarchy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.productHierarchy.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.location.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || plan.productHierarchy.category === selectedCategory;
    const matchesRegion = !selectedRegion || plan.location.region === selectedRegion;
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(plan.status);

    return matchesSearch && matchesCategory && matchesRegion && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Planning</h1>
          <div className="flex gap-4">
            <Button
              variant={planType === "top-down" ? "default" : "outline"}
              onClick={() => setPlanType("top-down")}
              className="gap-2"
            >
              <ArrowDown className="h-4 w-4" />
              Top-Down
            </Button>
            <Button
              variant={planType === "bottom-up" ? "default" : "outline"}
              onClick={() => setPlanType("bottom-up")}
              className="gap-2"
            >
              <ArrowUp className="h-4 w-4" />
              Bottom-Up
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create New Sales Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Sales Plan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSalesPlan} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formState.startDate}
                        onChange={(e) => handleFormChange("startDate", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formState.endDate}
                        onChange={(e) => handleFormChange("endDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Product Category</Label>
                      <Select
                        value={formState.category}
                        onValueChange={(value) => handleFormChange("category", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select
                        value={formState.subcategory}
                        onValueChange={(value) => handleFormChange("subcategory", value)}
                        disabled={!formState.category}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {formState.category &&
                            subcategories[formState.category as keyof typeof subcategories].map(
                              (subcategory) => (
                                <SelectItem key={subcategory} value={subcategory}>
                                  {subcategory}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={formState.region}
                        onValueChange={(value) => handleFormChange("region", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={formState.city}
                        onValueChange={(value) => handleFormChange("city", value)}
                        disabled={!formState.region}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {formState.region &&
                            cities[formState.region as keyof typeof cities].map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warehouse">Warehouse</Label>
                      <Select
                        value={formState.warehouse}
                        onValueChange={(value) => handleFormChange("warehouse", value)}
                        disabled={!formState.city || !warehouses[formState.city as keyof typeof warehouses]}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          {formState.city &&
                            warehouses[formState.city as keyof typeof warehouses]?.map(
                              (warehouse) => (
                                <SelectItem key={warehouse} value={warehouse}>
                                  {warehouse}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="channelType">Channel Type</Label>
                      <Select
                        value={formState.channelType}
                        onValueChange={(value) => handleFormChange("channelType", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {channelTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(formState.channelType === "B2B" || formState.channelType === "Wholesale") && (
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          value={formState.accountName}
                          onChange={(e) => handleFormChange("accountName", e.target.value)}
                          placeholder="Enter account name"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="targetValue">Target Value ($)</Label>
                      <Input
                        id="targetValue"
                        type="number"
                        min="0"
                        value={formState.targetValue}
                        onChange={(e) => handleFormChange("targetValue", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidence">Confidence (%)</Label>
                      <Input
                        id="confidence"
                        type="number"
                        min="0"
                        max="100"
                        value={formState.confidence}
                        onChange={(e) => handleFormChange("confidence", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes or comments..."
                      value={formState.notes}
                      onChange={(e) => handleFormChange("notes", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Plan</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="space-y-2">
                        {statuses.map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={status}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={(checked) => {
                                setSelectedStatuses(
                                  checked
                                    ? [...selectedStatuses, status]
                                    : selectedStatuses.filter((s) => s !== status)
                                );
                              }}
                            />
                            <label
                              htmlFor={status}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                            >
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Product Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time Frame</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Target Value</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalesPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      {new Date(plan.timeframe.startDate).toLocaleDateString()} -{" "}
                      {new Date(plan.timeframe.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {plan.productHierarchy.category} /{" "}
                      {plan.productHierarchy.subcategory} /{" "}
                      {plan.productHierarchy.sku}
                    </TableCell>
                    <TableCell>
                      {plan.location.region} / {plan.location.city} /{" "}
                      {plan.location.warehouse}
                    </TableCell>
                    <TableCell>
                      ${plan.planningValues.targetValue.toLocaleString()}
                    </TableCell>
                    <TableCell>{(plan.planningValues.confidence * 100).toFixed(0)}%</TableCell>
                    <TableCell>
                      <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {plan.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(plan.lastUpdated).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesPlanning;
