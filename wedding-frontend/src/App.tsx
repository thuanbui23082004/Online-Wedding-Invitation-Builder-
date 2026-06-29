import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
// import HomePage from "./pages/HomePage/HomePage";
import ResetPasswordPage from "./pages/PasswordPage/ResetPasswordPage";
import LoadingPage from "./pages/Loading/Loadingpage";
import Templates from "./pages/Templates/Templates";
import CreatedCards from "./pages/CreatedCards/CreatedCards";
import InvitationShow from "./pages/InvitationShow/InvitationShow";
import Reviews from "./pages/Reviews/Reviews";
import Contact from "./pages/Contact/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/created-cards" element={<CreatedCards />} />
          <Route path="/show/:id" element={<InvitationShow />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path ="/reset-password" element={<ResetPasswordPage />} />
          {/* <Route path ="/home"element={<HomePage />}/> */}
          <Route path="/loading" element={<LoadingPage />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;