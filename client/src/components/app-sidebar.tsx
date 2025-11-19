import {
  Building2,
  FileText,
  Home,
  DollarSign,
  Users,
  Settings,
  ClipboardCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

// Mock user data
const landlordMenu = [
  { title: "Dashboard", url: "/landlord", icon: Home },
  { title: "Meus Imóveis", url: "/landlord/properties", icon: Building2 },
  { title: "Contratos", url: "/landlord/contracts", icon: FileText },
  { title: "Pagamentos", url: "/landlord/payments", icon: DollarSign },
  { title: "Configurações", url: "/landlord/settings", icon: Settings },
];

const tenantMenu = [
  { title: "Dashboard", url: "/tenant", icon: Home },
  { title: "Meu Contrato", url: "/tenant/contract", icon: FileText },
  { title: "Pagamentos", url: "/tenant/payments", icon: DollarSign },
  { title: "Vistoria", url: "/tenant/inspection", icon: ClipboardCheck },
];

interface AppSidebarProps {
  userRole: "landlord" | "tenant";
  userName?: string;
}

export function AppSidebar({ userRole, userName = "Usuário" }: AppSidebarProps) {
  const [location, setLocation] = useLocation();
  const menu = userRole === "landlord" ? landlordMenu : tenantMenu;

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">AlugaFácil</h2>
            <p className="text-xs text-muted-foreground">
              {userRole === "landlord" ? "Locador" : "Locatário"}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation(item.url);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-md p-2 bg-sidebar-accent">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userRole === "landlord" ? "Proprietário" : "Inquilino"}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
