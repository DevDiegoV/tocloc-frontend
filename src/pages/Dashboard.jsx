import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Button, Badge, Form, Alert } from 'react-bootstrap';
import { reservationService } from '../services/api';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaList } from 'react-icons/fa';
import '../styles/Dashboard.css';
import { FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        if (user?.id) {
          const response = await reservationService.getByUser(user.id);
          setReservations(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        setReservations([]);
      }
    };

    if (user) {
      loadReservations();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setEditForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleCancelReservation = async (id) => {
    try {
      await reservationService.delete(id);
      setReservations(reservations.filter(res => res.id !== id));
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      await authService.deleteUser(user.id);
      authService.logout();
      navigate('/');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      setEditError('As senhas não coincidem');
      return;
    }

    try {
      const updateData = {
        id: user.id,
        name: editForm.name,
        email: editForm.email,
        ...(editForm.password && { password: editForm.password })
      };

      console.log('Dados a serem enviados:', updateData);

      const response = await authService.updateUser(updateData);
      
      if (response.data) {
        const updatedUser = {
          ...user,
          name: editForm.name,
          email: response.data.email,
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setEditSuccess('Perfil atualizado com sucesso!');
        setEditMode(false);
        
        setEditForm(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setEditError('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm">
          <Card.Body>
            <h3>Você precisa estar logado para acessar esta página.</h3>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Fazer Login
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h1 className="dashboard-title text-center mb-4">Minha Conta</h1>
              
              <Tab.Container defaultActiveKey="reservations">
                <Row>
                  <Col md={3} className="mb-4 mb-md-0">
                    <Nav variant="pills" className="flex-column dashboard-nav">
                      <Nav.Item>
                        <Nav.Link eventKey="reservations" className="d-flex align-items-center sidebar-nav-link">
                          <FaList className="me-2" />
                          <span>Minhas Reservas</span>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="profile" className="d-flex align-items-center sidebar-nav-link">
                          <FaUser className="me-2" />
                          <span>Perfil</span>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  
                  <Col md={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="reservations">
                        <h3 className="mb-4">Minhas Reservas</h3>
                        <Card className="profile-card shadow-sm">
                          <Card.Body>
                            <div className="d-flex justify-content-end mb-3">
                              <Badge bg="primary" className="reservation-count">
                                {reservations.length} {reservations.length === 1 ? 'Reserva' : 'Reservas'}
                              </Badge>
                            </div>
                            
                            {!Array.isArray(reservations) || reservations.length === 0 ? (
                              <div className="text-center py-4">
                                <FaCalendarAlt className="text-muted mb-3" size={40} />
                                <p className="lead mb-0">Você ainda não tem reservas.</p>
                              </div>
                            ) : (
                              <div className="reservations-grid">
                                {reservations.map(reservation => (
                                  <Card key={reservation.id} className="reservation-card mb-3 shadow-sm">
                                    <Card.Body>
                                      <h5 className="venue-name">
                                        <FaMapMarkerAlt className="me-2 text-primary" />
                                        {reservation?.localEsportesNome || 'Local não especificado'}
                                      </h5>
                                      <div className="reservation-details">
                                        <p className="mb-2">
                                          <FaCalendarAlt className="me-2 text-muted" />
                                          {new Date(reservation.dataHora).toLocaleDateString()}
                                        </p>
                                        <p className="mb-3">
                                          <FaClock className="me-2 text-muted" />
                                          {new Date(reservation.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                      </div>
                                      <Button 
                                        variant="outline-danger"
                                        size="sm"
                                        className="w-100"
                                        onClick={() => handleCancelReservation(reservation.id)}
                                      >
                                        Cancelar Reserva
                                      </Button>
                                    </Card.Body>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                      
                      <Tab.Pane eventKey="profile">
                        <h3 className="mb-4">Meu Perfil</h3>
                        <Card className="profile-card shadow-sm">
                          <Card.Body>
                            {!editMode ? (
                              <>
                                <div className="profile-info">
                                  <div className="info-item">
                                    <label>Nome</label>
                                    <p>{user.name || 'Nome não informado'}</p>
                                  </div>
                                  <div className="info-item">
                                    <label>Email</label>
                                    <p>{user.email}</p>
                                  </div>
                                  <div className="info-item">
                                    <label>Tipo de conta</label>
                                    <div className="role-badge">
                                      <Badge 
                                        bg={user.role === 'owner' ? 'success' : 'primary'} 
                                        className="user-role-badge"
                                      >
                                        {user.role === 'owner' ? 'Dono' : 'Usuário'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 d-flex justify-content-center gap-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    style={{ width: '200px' }}
                                    onClick={() => setEditMode(true)}
                                  >
                                    Editar Perfil
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    style={{ width: '200px' }}
                                    onClick={handleDeleteAccount}
                                  >
                                    <FaTrash className="me-2" style={{ marginBottom: '4px' }} />
                                    Excluir Conta
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <Form onSubmit={handleEditSubmit}>
                                {editError && <Alert variant="danger">{editError}</Alert>}
                                {editSuccess && <Alert variant="success">{editSuccess}</Alert>}

                                <Form.Group className="mb-3">
                                  <Form.Label>Nome</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    required
                                  />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                  <Form.Label>Email</Form.Label>
                                  <Form.Control
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    required
                                  />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                  <Form.Label>Nova Senha (opcional)</Form.Label>
                                  <Form.Control
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                                    placeholder="Deixe em branco para manter a senha atual"
                                  />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                  <Form.Label>Confirmar Nova Senha</Form.Label>
                                  <Form.Control
                                    type="password"
                                    value={editForm.confirmPassword}
                                    onChange={(e) => setEditForm({...editForm, confirmPassword: e.target.value})}
                                    placeholder="Confirme a nova senha"
                                    disabled={!editForm.password}
                                  />
                                </Form.Group>

                                <div className="d-flex justify-content-center gap-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    style={{ width: '200px' }}
                                    onClick={() => {
                                      setEditMode(false);
                                      setEditError('');
                                      setEditSuccess('');
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="primary"
                                    type="submit"
                                    size="sm"
                                    style={{ width: '200px' }}
                                  >
                                    Salvar Alterações
                                  </Button>
                                </div>
                              </Form>
                            )}
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 