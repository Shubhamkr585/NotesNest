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
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import AllNotes from './components/AllNotes';

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
           <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<div>Privacy Policy</div>}/>
            <Route path="/" element={<Home />} />
            <Route path="/notes/:noteId" element={<ViewNote />} />
            <Route path="/profile/:username" element={<PublicProfile />} />
      
            <Route element={<ProtectedRoute />}>
            <Route path="/notes" element={<AllNotes />} />
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