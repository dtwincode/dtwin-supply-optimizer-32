import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
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
  LayoutDashboard,
  AlertTriangle,
  Shield,
  Target,
  BarChart3,
  Layers,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useBreachData } from "@/hooks/useBreachData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const mainNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/inventory",
    description: "Overview & key metrics",
  },
  {
    title: "Alerts & Exceptions",
    icon: AlertTriangle,
    path: "/inventory?view=alerts",
    badge: true,
    description: "Buffer breaches & anomalies",
  },
  {
    title: "Buffer Management",
    icon: Shield,
    path: "/inventory?view=buffers",
    description: "Buffer status & zones",
  },
  {
    title: "Decoupling Points",
    icon: Target,
    path: "/inventory?view=decoupling",
    description: "Strategic positioning",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/inventory?view=analytics",
    description: "Performance insights",
  },
  {
    title: "Advanced",
    icon: Layers,
    path: "/inventory?view=advanced",
    description: "BOM & classifications",
  },
];

const configGroups = [
  {
    title: "Buffer Settings",
    items: [
      { title: "Buffer Profiles", path: "/inventory?view=config&tab=profiles" },
      { title: "Dynamic Adjustments", path: "/inventory?view=config&tab=daf" },
    ],
  },
  {
    title: "MOQ & Lead Times",
    items: [
      { title: "MOQ Settings", path: "/inventory?view=config&tab=moq" },
      { title: "Supplier Performance", path: "/inventory?view=config&tab=supplier" },
    ],
  },
  {
    title: "Detection & Analysis",
    items: [
      { title: "Spike Detection", path: "/inventory?view=config&tab=spike" },
      { title: "Analysis Results", path: "/inventory?view=config&tab=analysis" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Menu Mapping", path: "/inventory?view=config&tab=menu" },
      { title: "Storage Requirements", path: "/inventory?view=config&tab=storage" },
      { title: "Cost Structure", path: "/inventory?view=config&tab=costs" },
      { title: "Auto-Recalculation", path: "/inventory?view=config&tab=recalc" },
    ],
  },
];

export function InventorySidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const { unacknowledgedCount } = useBreachData();
  const [configOpen, setConfigOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/inventory" && currentPath === "/inventory") return true;
    if (path.includes("?view=config")) {
      return currentPath.includes("view=config");
    }
    if (path.includes("?view=")) {
      const viewMatch = path.match(/view=([^&]+)/);
      return viewMatch && currentPath.includes(`view=${viewMatch[1]}`);
    }
    return currentPath === path;
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>DDMRP Inventory</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.path) || undefined}>
                    <NavLink to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <div className="flex-1">
                            <div>{item.title}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                          {item.badge && unacknowledgedCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                              {unacknowledgedCount}
                            </Badge>
                          )}
                        </>
                      )}
                      {collapsed && item.badge && unacknowledgedCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration - Collapsed by default */}
        <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1.5">
                <Settings className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="flex-1">Configuration</span>
                    {configOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </>
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                {configGroups.map((group) => (
                  <div key={group.title} className="mb-3">
                    {!collapsed && (
                      <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {group.title}
                      </div>
                    )}
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={isActive(item.path) || undefined} className="text-xs pl-6">
                            <NavLink to={item.path}>
                              {!collapsed && <span>{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                ))}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
