import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { venueService } from '../services/api';

const VenueEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    endereco: ''
  });

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const response = await venueService.getById(id);
        if (response.data) {
          setFormData({
            nome: response.data.nome,
            endereco: response.data.endereco
          });
        }
      } catch (error) {
        console.error('Erro ao carregar local:', error);
        setError('Erro ao carregar dados do local');
      }
    };

    loadVenue();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await venueService.update(id, formData);
      setSuccess('Local atualizado com sucesso!');
      
      setTimeout(() => {
        navigate('/venues');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar local:', err);
      setError('Erro ao atualizar local. Tente novamente.');
    }
  };

  return (
    <>
      <div className="bg-primary text-white">
        <Container className="py-4 py-md-5">
          <Row className="align-items-center justify-content-center text-center">
            <Col md={8} lg={6}>
              <h1 className="display-5 fw-bold mb-3">Editar Local</h1>
              <p className="lead mb-4">
                Atualize as informações do seu espaço esportivo
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
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

                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/venues')}
                      style={{ width: '200px' }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      style={{ width: '200px' }}
                    >
                      Salvar Alterações
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

export default VenueEdit; 