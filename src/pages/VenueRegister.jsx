import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { venueService } from '../services/api';
import { authService } from '../services/auth';
import '../styles/VenueRegister.css';

const VenueRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    endereco: ''
  });

  // Verifica se o usuário é dono
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'owner') {
      navigate('/login');
    }
  }, [navigate]);

  const clearForm = () => {
    setFormData({
      ...formData,
      nome: '',
      endereco: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const user = authService.getCurrentUser();
      const payload = {
        nome: formData.nome,
        endereco: formData.endereco,
        dono: {
          id: user.id
        }
      };
      
      console.log('Payload:', payload);
      await venueService.create(payload);
      setSuccess('Local cadastrado com sucesso!');
      clearForm();
    } catch (err) {
      console.error('Erro ao cadastrar local:', err);
      setError('Erro ao cadastrar local. Tente novamente.');
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="bg-primary text-white">
        <Container className="py-4 py-md-5">
          <Row className="align-items-center justify-content-center text-center">
            <Col md={8} lg={6}>
              <h1 className="display-5 fw-bold mb-3">Cadastrar Local</h1>
              <p className="lead mb-4">
                Cadastre seu espaço esportivo e comece a receber reservas
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Formulário Section */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="mb-4">
                    {success}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Digite o nome do local"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                      placeholder="Digite o endereço completo"
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={!formData.nome || !formData.endereco}
                    >
                      Cadastrar Local
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VenueRegister; 