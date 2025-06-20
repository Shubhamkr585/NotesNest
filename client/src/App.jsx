import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Layout from './components/Layout.jsx';
import PublicRoute from './components/PublicRoutes.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <Routes>
    {/*PublicRoutes*/}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes with Layout (show navbar/footer) */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Optional: public page with layout */}
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default App;
