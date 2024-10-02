import axios from "axios";

// services/storeService.js
const API_URL = 'http://localhost:32780/api/stores';

// Función auxiliar para realizar solicitudes con autenticación
const fetchWithAuth = async (url, options = {}) => {
  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    if (response.status !== 204) { // Evita intentar parsear vacío en DELETE
      return await response.json();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtener todos las tiendas
export const getStores = async () => {
  return await fetchWithAuth(API_URL);
};

// Obtener una tienda por ID
export const getStoreById = async (storeId) => {
  return await fetchWithAuth(`${API_URL}/${storeId}`);
};

// Crear un nuevo storeo
export const createStore = async (newStore) => {
  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  try {
    const response = await axios.post(
      `${API_URL}`,
      newStore,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

// Actualizar un tiendao existente

export const updateStore = async (storeId, updatedStore) => {
  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  try {
    const response = await axios.put(
      `${API_URL}/${storeId}`, // Usamos storeId aquí
      updatedStore, // Pasamos el objeto updatedStore sin storeId
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Eliminar una tienda
export const deleteStore = async (storeId) => {
  return await fetchWithAuth(`${API_URL}/${storeId}`, {
    method: 'DELETE',
  });
};



