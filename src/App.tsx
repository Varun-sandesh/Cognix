import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> 6b1158926b7a5b9788e4f962b4e0dbd98e079b26
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import AiChat from "@/pages/AiChat";
import StaffDirectory from "@/pages/StaffDirectory";
import DoubtBoard from "@/pages/DoubtBoard";
<<<<<<< HEAD
import Leaderboard from "@/pages/Leaderboard";
import Auth from "@/pages/Auth";
=======
>>>>>>> 6b1158926b7a5b9788e4f962b4e0dbd98e079b26
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

<<<<<<< HEAD
function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Cognix...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<AiChat />} />
        <Route path="/directory" element={<StaffDirectory />} />
        <Route path="/doubts" element={<DoubtBoard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

=======
>>>>>>> 6b1158926b7a5b9788e4f962b4e0dbd98e079b26
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
<<<<<<< HEAD
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </AuthProvider>
=======
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<AiChat />} />
            <Route path="/directory" element={<StaffDirectory />} />
            <Route path="/doubts" element={<DoubtBoard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
>>>>>>> 6b1158926b7a5b9788e4f962b4e0dbd98e079b26
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
