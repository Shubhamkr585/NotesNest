import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout and Route Guards
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicRoute from './routes/PublicRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AllNotesPage from './pages/AllNotesPage.jsx';
import UploadNotePage from './pages/UploadNotePage.jsx';
import ViewNotePage from './pages/ViewNotePage.jsx';
import PublicProfilePage from './pages/PublicProfilePage.jsx';
import PurchasedNotesPage from './pages/PurchasedNotesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (Login/Register) that are only accessible when logged out */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Main application routes with Navbar and Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="notes" element={<AllNotesPage />} />
          <Route path="notes/:noteId" element={<ViewNotePage />} />
          <Route path="profile/:username" element={<PublicProfilePage />} />

          {/* Protected Routes (User must be logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="upload" element={<UploadNotePage />} />
            <Route path="purchased-notes" element={<PurchasedNotesPage />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;