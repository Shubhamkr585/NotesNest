import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import UploadNote from './components/UploadNote.jsx';
import NotesList from './components/NotesList.jsx';
import ViewNote from './components/ViewNote.jsx';
import PublicProfile from './components/PublicProfile.jsx';
import PurchasedNotes from './components/PurchasedNotes.jsx';
import Layout from './components/Layout.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/:noteId" element={<ViewNote />} />
            <Route path="/profile/:username" element={<PublicProfile />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/upload" element={<UploadNote />} />
              <Route path="/purchased-notes" element={<PurchasedNotes />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;