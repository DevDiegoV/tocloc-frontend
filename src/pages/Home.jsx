import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const Home = () => {
  const navigate = useNavigate();

  const isOwner = () => {
    const user = authService.getCurrentUser();
    return user?.role === 'owner';
  };

  return (
    <>
      {/* Seção Principal */}
      <div className="bg-primary text-white">
        <Container className="py-4 py-md-5">
          <Row className="align-items-center justify-content-center text-center">
            <Col md={8} lg={6}>
              <h1 className="display-5 fw-bold mb-3">Tocou, locou, jogou!</h1>
              <p className="lead mb-4">
                Encontre e reserve os melhores espaços esportivos da sua região.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-center">
                <Button 
                  variant="light" 
                  size="lg"
                  onClick={() => navigate('/venues')}
                  className="px-4 mb-2 mb-sm-0"
                >
                  Encontrar Locais
                </Button>
                {isOwner() && (
                  <Button 
                    variant="outline-light" 
                    size="lg"
                    onClick={() => navigate('/venue/register')}
                    className="px-4"
                  >
                    Cadastrar Local
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Como Funciona */}
      <Container className="py-4 py-md-5">
        <h2 className="text-center mb-4">Como Funciona</h2>
        <Row className="g-3">
          {[
            {
              titulo: "Busque",
              descricao: "Encontre locais próximos a você",
              icone: "🔍"
            },
            {
              titulo: "Reserve",
              descricao: "Escolha o horário e reserve online",
              icone: "📅"
            },
            {
              titulo: "Jogue",
              descricao: "Aproveite seu esporte favorito",
              icone: "⚡"
            }
          ].map((passo, index) => (
            <Col key={index} xs={12} md={4}>
              <Card className="h-100 text-center border-0">
                <Card.Body>
                  <div className="display-5 mb-2">{passo.icone}</div>
                  <Card.Title style={{ fontSize: '2rem' }}>{passo.titulo}</Card.Title>
                  <Card.Text className="small">{passo.descricao}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home; 