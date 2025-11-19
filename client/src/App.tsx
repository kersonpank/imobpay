import { Switch, Route, Redirect } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import OnboardingRole from "@/pages/OnboardingRole";
import LandlordDashboard from "@/pages/LandlordDashboard";
import LandlordProperties from "@/pages/LandlordProperties";
import LandlordContracts from "@/pages/LandlordContracts";
import LandlordPayments from "@/pages/LandlordPayments";
import LandlordSettings from "@/pages/LandlordSettings";
import TenantDashboard from "@/pages/TenantDashboard";
import TenantOnboarding from "@/pages/TenantOnboarding";
import NewProperty from "@/pages/NewProperty";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // User needs to complete onboarding (no role set)
  if (!user?.role) {
    return (
      <Switch>
        <Route path="/onboarding" component={OnboardingRole} />
        <Route>
          <Redirect to="/onboarding" />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      {user.role === "landlord" ? (
        <>
          <Route path="/" component={LandlordDashboard} />
          <Route path="/landlord" component={LandlordDashboard} />
          <Route path="/landlord/properties" component={LandlordProperties} />
          <Route path="/landlord/properties/new" component={NewProperty} />
          <Route path="/landlord/contracts" component={LandlordContracts} />
          <Route path="/landlord/payments" component={LandlordPayments} />
          <Route path="/landlord/settings" component={LandlordSettings} />
        </>
      ) : (
        <>
          <Route path="/" component={TenantDashboard} />
          <Route path="/tenant" component={TenantDashboard} />
          <Route path="/tenant/onboarding" component={TenantOnboarding} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedLayout() {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <Router />;
  }

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.email || "Usuário";

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar userRole={user.role} userName={displayName} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button 
                onClick={async () => {
                  await apiRequest("POST", "/api/auth/logout", {});
                  queryClient.setQueryData(["/api/auth/user"], null);
                  window.location.href = "/";
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
                data-testid="button-logout"
              >
                Sair
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthenticatedLayout />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
