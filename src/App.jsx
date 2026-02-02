import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import BannerManagement from "./pages/BannerManagement";
import ThreeDViewer from "./pages/ThreeDViewer";
import ContentManagement from "./pages/ContentManagement";
import MenuManagement from "./pages/MenuManagement";
import AboutOwner from "./pages/AboutOwner";
import AboutCafe from "./pages/AboutCafe";
import CareerManagement from "./pages/CareerManagement";
import FormManagement from "./pages/FormManagement";
import SEO from "./pages/SEO";

import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bannerManagement" element={<BannerManagement />} />
              <Route path="threeDViewer" element={<ThreeDViewer />} />
              <Route path="contentManagement" element={<ContentManagement />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="about-owner" element={<AboutOwner />} />
              <Route path="about-cafe" element={<AboutCafe />} />
              <Route path="career" element={<CareerManagement />} />
              <Route path="form" element={<FormManagement />} />
              <Route path="seo" element={<SEO />} />
              {/* <Route path="banners" element={<BannerManagement />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="menu/content" element={<MenuContent />} />
              <Route path="menu/list" element={<MenuList />} />

              <Route path="team" element={<TeamManagement />} />
              <Route path="branchs" element={<BranchManagement />} />
              <Route path="career" element={<CareerManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="form" element={<FormManagement />} />
              <Route path="review" element={<Review />} />
              <Route path="footer" element={<Footer />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="seo" element={<Seo />} /> */}

              {/* Add all other admin routes here */}
              <Route
                path="*"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Route>
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
