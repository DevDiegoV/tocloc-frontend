import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { venueService } from '../services/api';
import VenueList from '../components/venues/VenueList';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Venues.css';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    location: '',
  });

  const loadVenues = async () => {
    try {
      const response = await venueService.getAll();
      const venuesList = Array.isArray(response.data) ? response.data : [];
      setVenues(venuesList);
      setFilteredVenues(venuesList);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
      setVenues([]);
      setFilteredVenues([]);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const filtered = venues.filter(venue => {
      const nameMatch = venue.nome.toLowerCase().includes(filters.name.toLowerCase());
      const locationMatch = venue.endereco.toLowerCase().includes(filters.location.toLowerCase());

      if (!filters.name && !filters.location) return true;
      
      if (filters.name && !filters.location) return nameMatch;
      
      if (!filters.name && filters.location) return locationMatch;
      
      return nameMatch && locationMatch;
    });

    setFilteredVenues(filtered);
  };

  return (
    <>
      {/* Header Section */}
      <div className="bg-primary text-white">
        <Container className="py-4 py-md-5">
          <Row className="align-items-center justify-content-center text-center">
            <Col md={8} lg={6}>
              <h1 className="display-5 fw-bold mb-3">Locais Esportivos</h1>
              <p className="lead mb-4">
                Encontre o espaço perfeito para sua prática esportiva
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Filtros Section */}
      <div className="filter-section py-4">
        <Container>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Form onSubmit={handleSearch}>
                <Row className="g-3">
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label className="text-muted small">
                        <FaSearch className="me-2" />
                        Nome do Local
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Digite o nome do local"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label className="text-muted small">
                        <FaMapMarkerAlt className="me-2" />
                        Localização
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        placeholder="Digite o endereço do local"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col className="d-flex justify-content-center">
                    <Button 
                      variant="primary" 
                      type="submit"
                      style={{ width: '200px' }}
                    >
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Lista de Locais - Agora usando filteredVenues */}
      <Container className="py-4">
        <VenueList 
          venues={filteredVenues} 
          onVenueDeleted={loadVenues}
        />
      </Container>
    </>
  );
};

export default Venues; 