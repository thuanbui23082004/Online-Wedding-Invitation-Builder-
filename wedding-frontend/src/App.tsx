// ============================================================
// APP ROOT - Routes to Editor
// ============================================================

import { EditorPage } from './editor/page/EditorPage';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
// import HomePage from "./pages/HomePage/HomePage";
import ResetPasswordPage from "./pages/PasswordPage/ResetPasswordPage";
import LoadingPage from "./pages/Loading/Loadingpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/design" element={<EditorPage />} />
        {/* Redirect root to /design for convenience */}
        {/* <Route path="/" element={<Navigate to="/design" replace />} /> */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
