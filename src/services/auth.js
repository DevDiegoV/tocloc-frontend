import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data && response.data.userId) {
        const userData = {
          id: response.data.userId,
          email: credentials.email,
          role: response.data.role,
          name: response.data.name || ''
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('userChanged'));
      }
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  updateUser: async (userData) => {
    try {
      const apiData = {
        name: userData.name,
        email: userData.email,
        ...(userData.password && { password: userData.password })
      };

      console.log('Dados enviados para API:', apiData);

      const response = await api.put(`/users/${userData.id}`, apiData);
      
      if (response.data) {
        const updatedUser = {
          id: userData.id,
          name: userData.name,
          email: response.data.email,
          role: response.data.role || userData.role
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userChanged'));
      }
      return response;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userDeleted'));
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userDeleted'));
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      if (user && user.id && user.email && (user.role === 'user' || user.role === 'owner')) {
        return user;
      }
      
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user;
  },

  isOwner: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'owner';
  }
};

export default authService; 