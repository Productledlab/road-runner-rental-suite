
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import VehiclesPage from "./pages/VehiclesPage";
import ArchivedVehiclesPage from "./pages/ArchivedVehiclesPage";
import CustomersPage from "./pages/CustomersPage";
import BookingsPage from "./pages/BookingsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Routes accessible by both Admin and Branch Managers */}
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard allowedRoles={['admin', 'branch-manager']} redirectTo="/">
                  <Dashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/vehicles" 
              element={
                <AuthGuard allowedRoles={['admin', 'branch-manager']} redirectTo="/">
                  <VehiclesPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <AuthGuard allowedRoles={['admin', 'branch-manager']} redirectTo="/">
                  <CustomersPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <AuthGuard allowedRoles={['admin', 'branch-manager']} redirectTo="/">
                  <BookingsPage />
                </AuthGuard>
              } 
            />
            
            {/* Admin-only Routes */}
            <Route 
              path="/archived-vehicles" 
              element={
                <AuthGuard allowedRoles={['admin']} redirectTo="/">
                  <ArchivedVehiclesPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AuthGuard allowedRoles={['admin']} redirectTo="/">
                  <SettingsPage />
                </AuthGuard>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
