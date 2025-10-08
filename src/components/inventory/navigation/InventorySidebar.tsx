import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Target,
  Activity,
  BarChart3,
  Shield,
  AlertTriangle,
  PackageSearch,
  Settings,
  ChevronRight,
} from "lucide-react";

const mainNavItems = [
  {
    title: "Strategic Planning",
    icon: Target,
    items: [
      { title: "Alignment Dashboard", path: "/inventory?view=alignment" },
      { title: "Decoupling Manager", path: "/inventory?view=decoupling" },
      { title: "Supply Chain Network", path: "/inventory?view=network" },
      { title: "Recommendations", path: "/inventory?view=recommendations" },
    ],
  },
  {
    title: "Operations",
    icon: Activity,
    items: [
      { title: "Buffer Status", path: "/inventory?view=buffer-status" },
      { title: "Breach Detection", path: "/inventory?view=breach-detection" },
      { title: "Exception Management", path: "/inventory?view=exceptions" },
    ],
  },
  {
    title: "Analytics & Insights",
    icon: BarChart3,
    items: [
      { title: "Buffer Performance", path: "/inventory?view=buffer-performance" },
      { title: "SKU Classifications", path: "/inventory?view=sku-classifications" },
    ],
  },
  {
    title: "Buffer Profiles",
    icon: Shield,
    path: "/inventory?view=buffer-profiles",
  },
  {
    title: "Breach Alerts",
    icon: AlertTriangle,
    path: "/inventory?view=breach-alerts",
  },
  {
    title: "Bill of Materials",
    icon: PackageSearch,
    items: [
      { title: "BOM Viewer", path: "/inventory?view=bom-viewer" },
      { title: "BOM Explosion", path: "/inventory?view=bom-explosion" },
      { title: "Component Demand", path: "/inventory?view=component-demand" },
    ],
  },
];

const configItems = [
  { title: "Menu Mapping", path: "/inventory?view=config&tab=menu" },
  { title: "MOQ Settings", path: "/inventory?view=config&tab=moq" },
  { title: "Storage Requirements", path: "/inventory?view=config&tab=storage" },
  { title: "Supplier Performance", path: "/inventory?view=config&tab=supplier" },
  { title: "Cost Structure", path: "/inventory?view=config&tab=costs" },
  { title: "Dynamic Adjustments", path: "/inventory?view=config&tab=daf" },
  { title: "Spike Detection", path: "/inventory?view=config&tab=spike" },
  { title: "Auto-Recalculation", path: "/inventory?view=config&tab=recalc" },
  { title: "Analysis Results", path: "/inventory?view=config&tab=analysis" },
  { title: "System Settings", path: "/inventory?view=config&tab=system" },
];

export function InventorySidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isActive = (path: string) => {
    if (path.includes("?view=config")) {
      return currentPath.includes("view=config");
    }
    return currentPath === path;
  };

  const isGroupActive = (items?: { path: string }[]) => {
    if (!items) return false;
    return items.some((item) => isActive(item.path));
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Inventory</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <SidebarGroup>
                      <SidebarGroupLabel className="flex items-center gap-2 text-sm">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {item.items.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild isActive={isActive(subItem.path)}>
                                <NavLink to={subItem.path}>
                                  <ChevronRight className="h-3 w-3 mr-2" />
                                  {!collapsed && <span>{subItem.title}</span>}
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  ) : (
                    <SidebarMenuButton asChild isActive={isActive(item.path!)}>
                      <NavLink to={item.path!}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {!collapsed && <span>Configuration</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} className="text-xs">
                    <NavLink to={item.path}>
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
