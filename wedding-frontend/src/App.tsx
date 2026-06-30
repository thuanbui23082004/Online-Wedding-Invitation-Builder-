import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
// import HomePage from "./pages/HomePage/HomePage";
import ResetPasswordPage from "./pages/PasswordPage/ResetPasswordPage";
import LoadingPage from "./pages/Loading/Loadingpage";
import TemplatesPage from "./pages/TemplatesPage/Templates";
import CreatedCards from "./pages/CreatedCards/CreatedCards";
import InvitationShow from "./pages/InvitationShow/InvitationShow";
import Reviews from "./pages/Reviews/Reviews";
import Contact from "./pages/Contact/Contact";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Overview } from './features/dashboard/Overview';
import { MyCards } from './features/dashboard/MyCards';
import { Templates } from './features/templates/Templates';
import { Wishes } from './features/dashboard/Wishes';
import { RSVP } from './features/dashboard/RSVP';
import { ReceivedGifts } from './features/dashboard/ReceivedGifts';
import { AccountProfile } from './features/dashboard/AccountProfile';
import { MyPlan } from './features/dashboard/MyPlan';
import { Feedback } from './features/dashboard/Feedback';
import { WeddingCanvasEditor } from './features/editor/WeddingCanvasEditor';
import { PublicCardViewer } from './features/public-card/PublicCardViewer';
import { PaymentQR} from './features/dashboard/Paymentqr';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/created-cards" element={<CreatedCards />} />
          <Route path="/show/:id" element={<InvitationShow />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path ="/reset-password" element={<ResetPasswordPage />} />
          {/* <Route path ="/home"element={<HomePage />}/> */}
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="/dashboard/overview" element={<Overview />} />
          <Route path="/dashboard/my-cards" element={<MyCards />} />
          <Route path="/dashboard/templates" element={<Templates />} />
          <Route path="/dashboard/wishes" element={<Wishes />} />
          <Route path="/dashboard/rsvp" element={<RSVP />} />
          <Route path="/dashboard/gifts" element={<ReceivedGifts />} />
          <Route path="/dashboard/account" element={<AccountProfile />} />
          <Route path="/dashboard/plan" element={<MyPlan />} />
          <Route path="/dashboard/payment" element={<PaymentQR />} />
          <Route path="/dashboard/feedback" element={<Feedback />} />
          <Route path="/editor" element={<WeddingCanvasEditor />} />
          <Route path="/thiep/:slug" element={<PublicCardViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;