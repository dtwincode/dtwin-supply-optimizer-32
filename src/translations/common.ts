
import { CommonTranslations } from './types';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { modulesSummaryTranslations, moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';
import { logisticsTranslations } from './common/logistics';
import { ddsopTranslations } from './common/ddsop';
import { zonesTranslations } from './common/zones';

// Creating a proper CommonTranslations object that matches the interface
export const commonTranslations: CommonTranslations = {
  loading: "Loading...",
  noData: "No data available",
  error: "Error",
  success: "Success",
  confirm: "Confirm",
  back: "Back",
  next: "Next",
  submit: "Submit",
  skus: "SKUs",
  create: "Create",
  
  // Zone translations
  zones: {
    green: "Green Zone",
    yellow: "Yellow Zone",
    red: "Red Zone"
  },
  
  // Individual inventory translations
  inventory: {
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    overstock: "Overstock",
    onOrder: "On Order",
    allocated: "Allocated",
    available: "Available",
    decouplingPoints: "Decoupling Points",
    configureDecouplingPoints: "Configure Decoupling Points",
    refresh: "Refresh",
    addDecouplingPoint: "Add Decoupling Point",
    decouplingNetwork: "Network View",
    listView: "List View",
    locationId: "Location ID",
    type: "Type",
    description: "Description",
    actions: "Actions",
    noDecouplingPoints: "No Decoupling Points",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Confirm Delete",
    success: "Success",
    decouplingPointDeleted: "Decoupling Point Deleted",
    decouplingPointSaved: "Decoupling Point Saved",
    networkVisualization: "Network Visualization",
    nodes: "Nodes",
    links: "Links",
    totalItems: "Total Items",
    networkHelp: "Network Help",
    nodesDescription: "Network nodes represent locations in the supply chain",
    linksDescription: "Links represent connections between nodes"
  },
  
  // Chart translations
  chartTitles: {
    bufferProfile: "Buffer Profile",
    demandVariability: "Demand Variability"
  },
  
  // Add missing chart translations
  replenishment: "Replenishment",
  netFlow: "Net Flow",
  inventoryTrends: "Inventory Trends",
  
  // Pagination translations 
  previous: "Previous",
  page: "Page",
  of: "of",
  perPage: "Per Page",
  items: "Items",
  showing: "Showing",
  to: "to",
  
  // Add other required common translations
  settings: "Settings",
  logout: "Logout",
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
  edit: "Edit",
  search: "Search",
  filter: "Filter",
  apply: "Apply",
  reset: "Reset",
  modules: "Modules",
  skuCount: "SKU Count",
  accuracyLabel: "Accuracy",
  pipelineValue: "Pipeline Value",
  activeCampaigns: "Active Campaigns",
  onTimeDelivery: "On-Time Delivery",
  reportCount: "Available Reports",
  thisQuarter: "this quarter",
  fromLastMonth: "from last month",
  fromLastWeek: "from last week",
  viewDetails: "View Details",
  purchaseOrderCreated: "Purchase order created successfully",
  refresh: "Refresh",
  
  // Required by the interface
  warning: "Warning",
  info: "Information",
  clear: "Clear",
  all: "All",
  none: "None",
  select: "Select",
  login: "Login",
  register: "Register",
  username: "Username",
  password: "Password",
  email: "Email",
  phone: "Phone",
  address: "Address",
  name: "Name",
  description: "Description",
  update: "Update"
};
