import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Serviços de Locais Esportivos
export const venueService = {
  getAll: (filters = {}) => api.get('/local-esportes', { params: filters }),
  getById: (id) => api.get(`/local-esportes/${id}`),
  create: (data) => {
    const payload = {
      nome: data.nome,
      endereco: data.endereco,
      dono: {
        id: data.dono.id
      }
    };
    return api.post('/local-esportes', payload);
  },
  delete: (id) => api.delete(`/local-esportes/${id}`),
  getByOwner: (ownerId) => api.get(`/dono/${ownerId}`),
  update: (id, data) => {
    return api.put(`/local-esportes/${id}`, {
      nome: data.nome,
      endereco: data.endereco
    });
  },
};

// Serviços de Reservas
export const reservationService = {
  create: (data) => {
    const payload = {
      dataHora: data.dataHora,
      localEsportes: {
        id: data.localEsportes.id
      },
      user: {
        id: data.user.id
      }
    };
    return api.post('/reservas', payload);
  },
  getByUser: (userId) => api.get(`/reservas/usuario/${userId}`),
  delete: (id) => api.delete(`/reservas/${id}`),
  getByVenueAndDate: (venueId) => {
    return api.get(`/reservas/local/${venueId}`);
  },
};

export default api;