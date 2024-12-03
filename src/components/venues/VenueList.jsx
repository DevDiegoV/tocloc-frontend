import React, { useState } from 'react';
import { Card, Button, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { reservationService, venueService } from '../../services/api';
import { authService } from '../../services/auth';
import { FaMapMarkerAlt, FaCalendarAlt, FaTrash, FaEdit } from 'react-icons/fa';
import '../../styles/VenueList.css';

const VenueList = ({ venues = [], onVenueDeleted }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingReservations, setExistingReservations] = useState([]);

  const currentUser = authService.getCurrentUser();
  const isOwner = currentUser?.role === 'owner';

  const handleReserve = (venue) => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedVenue(venue);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVenue(null);
    setSelectedDate('');
    setSelectedTime('09:00');
    setError('');
    setSuccess('');
  };

  const fetchExistingReservations = async (venueId) => {
    try {
      const response = await reservationService.getByVenueAndDate(venueId);
      setExistingReservations(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
      setError('Erro ao verificar disponibilidade. Tente novamente.');
    }
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const user = authService.getCurrentUser();
      if (!user) {
        setError('Você precisa estar logado para fazer uma reserva');
        return;
      }

      const dataHora = `${selectedDate}T${selectedTime}:00`;

      const isTimeSlotTaken = existingReservations.some(reservation => {
        const reservationDateTime = new Date(reservation.dataHora);
        const selectedDateTime = new Date(dataHora);
        
        return reservationDateTime.getTime() === selectedDateTime.getTime();
      });

      if (isTimeSlotTaken) {
        setError('Este horário já está reservado. Por favor, escolha outro horário.');
        return;
      }

      const payload = {
        dataHora: dataHora,
        localEsportes: {
          id: selectedVenue.id
        },
        user: {
          id: user.id
        }
      };

      await reservationService.create(payload);
      setSuccess('Reserva realizada com sucesso!');
      setTimeout(() => {
        handleCloseModal();
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Erro ao fazer reserva:', err);
      setError('Erro ao fazer a reserva. Tente novamente.');
    }
  };

  const handleTimeChange = (increment) => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes;

    if (increment) {
      newMinutes += 30;
      if (newMinutes >= 60) {
        newMinutes = 0;
        newHours += 1;
      }
      if (newHours >= 22) {
        newHours = 22;
        newMinutes = 0;
      }
    } else {
      newMinutes -= 30;
      if (newMinutes < 0) {
        newMinutes = 30;
        newHours -= 1;
      }
      if (newHours < 6) {
        newHours = 6;
        newMinutes = 0;
      }
    }

    setSelectedTime(
      `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
    );
  };

  // Função para desabilitar datas passadas
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleDelete = async (venue) => {
    if (window.confirm('Tem certeza que deseja excluir este local?')) {
      try {
        await venueService.delete(venue.id);
        if (onVenueDeleted) {
          onVenueDeleted(); // Callback para atualizar a lista
        }
      } catch (err) {
        console.error('Erro ao deletar local:', err);
        alert('Erro ao deletar local. Tente novamente.');
      }
    }
  };

  const handleEdit = (venue) => {
    navigate(`/venue/edit/${venue.id}`);
  };

  return (
    <>
      <Row className="g-4 justify-content-center">
        {venues.map((venue) => (
          <Col 
            key={venue.id} 
            xs={12}
            sm={8}
            md={6}
            lg={4}
            className={`${venues.length === 1 ? 'col-sm-8 col-md-6 col-lg-4' : ''}`}
          >
            <Card className="h-100 shadow hover-shadow">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Card.Title className="h5 mb-0 text-primary">{venue.nome}</Card.Title>
                  {isOwner && (
                    <div className="d-flex gap-2">
                      <Button 
                        variant="link" 
                        className="text-primary p-0"
                        onClick={() => handleEdit(venue)}
                        title="Editar local"
                      >
                        <FaEdit size={14} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger p-0"
                        onClick={() => handleDelete(venue)}
                        title="Deletar local"
                      >
                        <FaTrash size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <FaMapMarkerAlt className="me-2" size={14} />
                    <small>{venue.endereco}</small>
                  </div>
                </div>

                <div className="mt-auto">
                  {isOwner && venue.dono?.id === currentUser?.id ? (
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline-primary"
                        onClick={() => handleEdit(venue)}
                        className="w-100"
                      >
                        <FaEdit className="me-2" style={{ marginBottom: '4px' }}/>
                        Editar Local
                      </Button>
                      <Button 
                        variant="outline-danger"
                        onClick={() => handleDelete(venue)}
                        className="w-100"
                      >
                        <FaTrash className="me-2" style={{ marginBottom: '4px' }}/>
                        Deletar Local
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="primary"
                      onClick={() => handleReserve(venue)}
                      className="w-100"
                    >
                      <FaCalendarAlt className="me-2" style={{ marginBottom: '4px' }}/>
                      Reservar Horário
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {venues.length === 0 && (
          <Col xs={12}>
            <div className="text-center py-5">
              <p className="text-muted mb-0">Nenhum local encontrado.</p>
              <small className="text-muted">Tente ajustar seus filtros de busca.</small>
            </div>
          </Col>
        )}
      </Row>

      {/* Modal de Reserva */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        centered 
        dialogClassName="reservation-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Fazer Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedVenue && (
            <>
              <div className="mb-3">
                <h5 className="mb-1">{selectedVenue.name}</h5>
                <p className="text-muted small mb-0">{selectedVenue.address}</p>
              </div>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
              {success && <Alert variant="success" className="py-2 small">{success}</Alert>}

              <Form onSubmit={handleSubmitReservation}>
                <Form.Group className="mb-3">
                  <Form.Label className="small mb-1">Data da Reserva</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (selectedVenue) {
                        fetchExistingReservations(selectedVenue.id);
                      }
                    }}
                    min={getMinDate()}
                    required
                    size="sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small mb-1 d-block text-center">Horário da Reserva</Form.Label>
                  <div className="d-flex align-items-center justify-content-center">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => handleTimeChange(false)}
                      className="me-2"
                      size="sm"
                    >
                      &#9664;
                    </Button>
                    <Form.Control
                      type="text"
                      value={selectedTime}
                      readOnly
                      className={`text-center ${
                        existingReservations.some(r => {
                          const reservationDate = new Date(r.dataHora).toISOString().split('T')[0];
                          const reservationTime = new Date(r.dataHora).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          });
                          return reservationDate === selectedDate && reservationTime === selectedTime;
                        }) ? 'bg-danger text-white' : ''
                      }`}
                      style={{ width: '80px' }}
                      size="sm"
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => handleTimeChange(true)}
                      className="ms-2"
                      size="sm"
                    >
                      &#9654;
                    </Button>
                  </div>
                  <Form.Text className="text-muted d-block text-center small mt-2">
                    Horário de funcionamento: 06:00 às 22:00
                    {existingReservations.length > 0 && (
                      <div className="text-danger mt-1">
                        Horários em vermelho já estão reservados
                      </div>
                    )}
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    size="sm"
                  >
                    Confirmar Reserva
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleCloseModal}
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VenueList; 