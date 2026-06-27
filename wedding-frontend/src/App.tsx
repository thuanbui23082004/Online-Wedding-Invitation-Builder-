import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      {/* <Route
      path ="/home"
      element={
          <HomePage />
      }
    /> */}
    </BrowserRouter>
  );
}

export default App;