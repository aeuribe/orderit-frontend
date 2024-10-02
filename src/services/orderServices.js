import axios from "axios";

// services/orderService.js
const API_URL = 'http://localhost:32780/api/orders';

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

export const fetchOrderDetails = async (orderId) => {
  return await fetchWithAuth(`${API_URL}/${orderId}/details`);
};

// Obtener todos las ordenes
export const getOrders = async () => {
  return await fetchWithAuth(API_URL);
};

//Obtener ordenes por salesperson
export const getOrdersBySalesperson = async (salespersonId) => {
  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  try {
    const response = await axios.get(
      `http://localhost:32780/api/orders/salesperson?salespersonId=${salespersonId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/plain',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error en la respuesta del servidor
      console.error("Error en la respuesta del servidor:", error.response.data);
      throw new Error(error.response.data.message || "Error en la solicitud");
    } else if (error.request) {
      // Solicitud hecha pero sin respuesta
      console.error("Sin respuesta del servidor:", error.request);
      throw new Error("No se recibió respuesta del servidor");
    } else {
      // Error al configurar la solicitud
      console.error("Error al configurar la solicitud:", error.message);
      throw new Error("Error en la configuración de la solicitud");
    }
  }
};

// Obtener una orden por ID
export const getOrderById = async (orderId) => {
  return await fetchWithAuth(`${API_URL}/${orderId}`);
};

// Crear una nueva orden
export const createOrder = async (newOrder, storeId, salespersonId) => {
  console.log("Order Data:", newOrder); // Mostrar todos los datos del pedido
  console.log("Total desde createOrder:", newOrder.total); // Verificar el valor específico del campo total
  console.log("Store ID:", storeId, "Salesperson ID:", salespersonId); // Verificar IDs

  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  try {
    const response = await axios.post(
      `${API_URL}?storeId=${storeId}&salespersonId=${salespersonId}`,
      newOrder,
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


// Actualizar una orden existente
export const updateOrder = async (orderId, updatedOrder, storeId, salespersonId) => {
  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  try {
    const response = await axios.put(
      `${API_URL}/${orderId}?storeId=${storeId}&salespersonId=${salespersonId}`,
      updatedOrder,
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


// Eliminar una orden
export const deleteOrder = async (orderId) => {
  return await fetchWithAuth(`${API_URL}/${orderId}`, {
    method: 'DELETE',
  });
};

