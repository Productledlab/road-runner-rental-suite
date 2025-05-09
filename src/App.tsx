
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import VehiclesPage from "./pages/VehiclesPage";
import ArchivedVehiclesPage from "./pages/ArchivedVehiclesPage";
import CustomersPage from "./pages/CustomersPage";
import BookingsPage from "./pages/BookingsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthGuard from "./components/auth/AuthGuard";
import CompaniesPage from "./pages/CompaniesPage";
import BranchesPage from "./pages/BranchesPage";
import UsersPage from "./pages/UsersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Super Admin */}
          <Route
            path="/companies"
            element={
              <AuthGuard allowedRoles={['super_admin']} redirectTo="/">
                <CompaniesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/branches"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin']} redirectTo="/">
                <BranchesPage />
              </AuthGuard>
            }
          />

          <Route
            path="/users"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin']} redirectTo="/">
                <UsersPage />
              </AuthGuard>
            }
          />

          {/* Routes accessible by both Admin and Branch Managers */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin', 'branch_admin', 'staff']} redirectTo="/">
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/vehicles"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin', 'branch_admin', 'staff']} redirectTo="/">
                <VehiclesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/customers"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin', 'branch_admin', 'staff']} redirectTo="/">
                <CustomersPage />
              </AuthGuard>
            }
          />
          <Route
            path="/bookings"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin', 'branch_admin', 'staff']} redirectTo="/">
                <BookingsPage />
              </AuthGuard>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/archived-vehicles"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin', 'branch_admin', 'staff']} redirectTo="/">
                <ArchivedVehiclesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard allowedRoles={['super_admin', 'company_admin', 'branch_admin', 'staff']} redirectTo="/">
                <SettingsPage />
              </AuthGuard>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
