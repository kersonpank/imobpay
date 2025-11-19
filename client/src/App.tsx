import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import LandlordDashboard from "@/pages/LandlordDashboard";
import LandlordProperties from "@/pages/LandlordProperties";
import LandlordContracts from "@/pages/LandlordContracts";
import LandlordPayments from "@/pages/LandlordPayments";
import LandlordSettings from "@/pages/LandlordSettings";
import TenantDashboard from "@/pages/TenantDashboard";
import TenantOnboarding from "@/pages/TenantOnboarding";
import NewProperty from "@/pages/NewProperty";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandlordDashboard} />
      <Route path="/landlord" component={LandlordDashboard} />
      <Route path="/landlord/properties" component={LandlordProperties} />
      <Route path="/landlord/properties/new" component={NewProperty} />
      <Route path="/landlord/contracts" component={LandlordContracts} />
      <Route path="/landlord/payments" component={LandlordPayments} />
      <Route path="/landlord/settings" component={LandlordSettings} />
      <Route path="/tenant" component={TenantDashboard} />
      <Route path="/tenant/onboarding" component={TenantOnboarding} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // todo: remove mock functionality - this should come from authentication
  const [userRole] = useState<"landlord" | "tenant">("landlord");
  const [userName] = useState("Carlos Silva");

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar userRole={userRole} userName={userName} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-8">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
