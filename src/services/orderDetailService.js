import axios from 'axios';

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

// Obtener detalles de una orden por ID
export const getOrderDetailById = async (orderId, orderDetailId) => {
    return await fetchWithAuth(`${API_URL}/${orderId}/details/${orderDetailId}`);
};

// Obtener todos los detalles de una orden por ID de orden
export const getOrdersDetailByOrderId = async (orderId) => {
    return await fetchWithAuth(`${API_URL}/${orderId}/details`);
};

// Crear un nuevo detalle de orden
export const createOrderDetail = async (orderId, productId, orderDetailDto) => {
    const storedUser = localStorage.getItem('LoggedOrderItAppUser');
    if (!storedUser) throw new Error("No se encontró el usuario autenticado");

    const token = JSON.parse(storedUser);
    if (!token) throw new Error("Token de autenticación no disponible");

    try {
        const response = await axios.post(
            `${API_URL}/${orderId}?productId=${productId}`,
            orderDetailDto,
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

// Actualizar un detalle de orden existente
export const updateOrderDetail = async (orderId, orderDetailId, productId, orderDetailDto) => {
    const storedUser = localStorage.getItem('LoggedOrderItAppUser');
    if (!storedUser) throw new Error("No se encontró el usuario autenticado");

    const token = JSON.parse(storedUser);
    if (!token) throw new Error("Token de autenticación no disponible");

    try {
        const response = await axios.put(
            `${API_URL}/${orderId}/details/${orderDetailId}?productId=${productId}`,
            orderDetailDto,
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

// Eliminar un detalle de orden
export const deleteOrderDetail = async (orderId, orderDetailId) => {
    return await fetchWithAuth(`${API_URL}/${orderId}/details/${orderDetailId}`, {
        method: 'DELETE',
    });
};

// Eliminar todos los detalles de una orden
export const deleteDetailsByOrder = async (orderId) => {
    return await fetchWithAuth(`${API_URL}/DeleteDetailsByOrder/${orderId}`, {
        method: 'DELETE',
    });
};
