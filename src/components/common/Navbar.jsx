import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { authService } from '../../services/auth';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Navbar.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const checkUser = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    };

    checkUser();
    window.addEventListener('userChanged', checkUser);
    window.addEventListener('userDeleted', checkUser);

    return () => {
      window.removeEventListener('userChanged', checkUser);
      window.removeEventListener('userDeleted', checkUser);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-custom py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo fs-4 fw-bold">
          Tocloc
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link 
              as={Link} 
              to="/venues"
              className={`px-3 ${location.pathname === '/venues' ? 'active nav-link-active' : ''}`}
            >
              Locais
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about"
              className={`px-3 ${location.pathname === '/about' ? 'active nav-link-active' : ''}`}
            >
              Sobre
            </Nav.Link>
          </Nav>
          <Nav>
            {!currentUser ? (
              <div className="d-flex gap-3">
                <Button 
                  variant="outline-light" 
                  onClick={() => navigate('/login')}
                  className="nav-button px-4"
                >
                  Entrar
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => navigate('/register')}
                  className="nav-button px-4"
                >
                  Cadastrar
                </Button>
              </div>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="nav-user-dropdown text-white border-0 d-flex align-items-center">
                  <div className="me-2">
                    <FaUser style={{ marginBottom: '4px'}}/>
                  </div>
                  <span className="me-1">{currentUser.name || 'Minha Conta'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark mt-2 py-2">
                  <Dropdown.Item as={Link} to="/dashboard" className="dropdown-item px-4 py-2">
                    <FaUser className="me-2" style={{ marginBottom: '4px' }}/>
                    Minha Conta
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-2" />
                  <Dropdown.Item onClick={handleLogout} className="dropdown-item px-4 py-2 text-danger">
                    <FaSignOutAlt className="me-2" />
                    Sair
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 