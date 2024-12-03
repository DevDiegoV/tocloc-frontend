import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Components
import Navigation from './components/common/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Venues from './pages/Venues';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import VenueRegister from './pages/VenueRegister';
import VenueEdit from './pages/VenueEdit';
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navigation />
        
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venue/register" element={<VenueRegister />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/venue/edit/:id" element={<VenueEdit />} />
          </Routes>
        </main>

        <footer className="bg-dark text-white py-4 mt-auto">
          <Container className="text-center">
            <p className="mb-0">&copy; 2024 Tocloc - Todos os direitos reservados</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
