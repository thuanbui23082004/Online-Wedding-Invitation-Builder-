// ============================================================
// APP ROOT - Routes
// ============================================================

import { EditorPage } from './features/editor/page/EditorPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import LoadingPage from "./pages/Loading/Loadingpage";
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { MyCardsPage } from './pages/MyCardsPage/MyCardsPage';
import CardDetailPage from './pages/Dashboard/CardDetailPage/CardDetailPage';
import { PageTransition } from './components/PageTransition';
import { RouteProgressBar } from './components/RouteProgressBar';


// Dashboard
import { Overview } from './features/dashboard/pages/Overview';
import { MyCards as MyCardsDashboard } from './features/dashboard/pages/MyCards';
import { CreateCard } from './features/dashboard/pages/CreateCard';
import { Wishes } from './features/dashboard/pages/Wishes';
import { RSVP } from './features/dashboard/pages/RSVP';
import { ReceivedGifts } from './features/dashboard/pages/ReceivedGifts';
import { AccountProfile } from './features/dashboard/pages/AccountProfile';
import { MyPlan } from './features/dashboard/pages/MyPlan';
import { PaymentQR } from './features/dashboard/pages/Paymentqr';
import { Feedback } from './features/dashboard/pages/Feedback';
import { TemplatesDashboard } from './features/dashboard/pages/TemplatesDashboard';

// Admin
import { AdminLayout } from './features/admin/layout/AdminLayout';
import { DashboardPage } from './features/admin/pages/DashboardPage';
import { UsersListPage } from './features/admin/pages/UsersListPage';
import { CardsListPage } from './features/admin/pages/CardsListPage';
import { TemplatesListPage } from './features/admin/pages/TemplatesListPage';
import { PlansPage } from './features/admin/pages/PlansPage';
import { LibraryElementsPage } from './features/admin/pages/LibraryElementsPage';
import { TemplateCategoriesPage } from './features/admin/pages/TemplateCategoriesPage';
import { ModerationPage } from './features/admin/pages/ModerationPage';
import Templates from './pages/Templates/Templates';
import { Reviews } from './pages/Reviews/Reviews';
import { Contact } from './pages/Contact/Contact';
import { PublicViewPage } from './pages/PublicViewPage/PublicViewPage';


function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <RouteProgressBar />
      <PageTransition>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/my-cards" element={<MyCardsPage />} />
          <Route path="/design" element={<EditorPage />} />
          <Route path="/design/template" element={<EditorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/loading" element={<LoadingPage />} />

          {/* Static Pages */}
          <Route path="/templates" element={<Templates />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />

          {/* Dashboard routes - using feature components */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="/dashboard/overview" element={<Overview />} />
          <Route path="/dashboard/my-cards" element={<MyCardsDashboard />} />
          <Route path="/dashboard/create" element={<CreateCard />} />
          <Route path="/dashboard/cards/:id" element={<CardDetailPage />} />
          <Route path="/dashboard/templates" element={<TemplatesDashboard />} />
          <Route path="/dashboard/wishes" element={<Wishes />} />
          <Route path="/dashboard/rsvp" element={<RSVP />} />
          <Route path="/dashboard/gifts" element={<ReceivedGifts />} />
          <Route path="/dashboard/account" element={<AccountProfile />} />
          <Route path="/dashboard/plan" element={<MyPlan />} />
          <Route path="/dashboard/payment-qr" element={<PaymentQR />} />
          <Route path="/dashboard/feedback" element={<Feedback />} />

          {/* Admin routes — protected by AdminLayout guard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersListPage />} />
            <Route path="cards" element={<CardsListPage />} />
            <Route path="templates" element={<TemplatesListPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="elements" element={<LibraryElementsPage />} />
            <Route path="categories" element={<TemplateCategoriesPage />} />
            <Route path="moderation" element={<ModerationPage />} />
          </Route>


          {/* Public wedding card viewer - no auth required */}
          <Route path="/view/:slug" element={<PublicViewPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}

export default App;
