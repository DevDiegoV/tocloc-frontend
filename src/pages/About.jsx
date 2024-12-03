import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaSearch, FaCalendarCheck, FaFutbol, FaUsers, FaMapMarkedAlt, FaMedal } from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  const beneficios = [
    {
      icon: <FaUsers />,
      title: "Comunidade Esportiva",
      description: "Conecte-se com outros esportistas e faça parte de uma comunidade ativa"
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Locais Verificados",
      description: "Todos os espaços são verificados para garantir qualidade e segurança"
    },
    {
      icon: <FaMedal />,
      title: "Experiência Premium",
      description: "Acesso aos melhores espaços esportivos da sua região"
    }
  ];

  const steps = [
    {
      icon: <FaSearch />,
      title: "Encontre",
      description: "Busque locais esportivos próximos a você",
      color: "primary"
    },
    {
      icon: <FaCalendarCheck />,
      title: "Reserve",
      description: "Escolha o horário e faça sua reserva online",
      color: "success"
    },
    {
      icon: <FaFutbol />,
      title: "Jogue",
      description: "Aproveite sua atividade esportiva",
      color: "info"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section - Ajustado para ficar igual ao Home */}
      <div className="bg-primary text-white">
        <Container className="py-4 py-md-5">
          <Row className="align-items-center justify-content-center text-center">
            <Col md={8} lg={6}>
              <h1 className="display-5 fw-bold mb-3">Sobre o Tocloc</h1>
              <p className="lead mb-4">
                Transformando a maneira como as pessoas praticam esportes
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Missão Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="section-title">Nossa Missão</h2>
              <p className="lead mission-text">
                Conectar pessoas através do esporte, facilitando o acesso a espaços esportivos 
                de qualidade e promovendo uma vida mais ativa e saudável.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Como Funciona Section */}
      <section className="py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Como Funciona</h2>
          <Row className="g-4">
            {steps.map((step, index) => (
              <Col key={index} md={4}>
                <Card className="step-card h-100 text-center">
                  <Card.Body>
                    <div className={`icon-wrapper bg-${step.color}`}>
                      {step.icon}
                    </div>
                    <Card.Title className="mt-4 mb-3">{step.title}</Card.Title>
                    <Card.Text>{step.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Benefícios Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-5">Benefícios</h2>
          <Row className="g-4">
            {beneficios.map((beneficio, index) => (
              <Col key={index} md={4}>
                <div className="benefit-card text-center">
                  <div className="benefit-icon">
                    {beneficio.icon}
                  </div>
                  <h3 className="h4 mt-4 mb-3">{beneficio.title}</h3>
                  <p className="mb-0">{beneficio.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About; 