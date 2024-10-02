import axios from "axios";

// services/productService.js
const API_URL = 'http://localhost:32780/api/products';

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

// Obtener todos los productos
export const getProducts = async () => {
  return await fetchWithAuth(API_URL);
};

// Obtener un producto por ID
export const getProductById = async (productId) => {
  return await fetchWithAuth(`${API_URL}/${productId}`);
};

// Crear un nuevo producto
export const createProduct = async (newProduct, brandId, categoryId) => {
  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  try {
    const response = await axios.post(
      `${API_URL}?brandId=${brandId}&categoryId=${categoryId}`,
      newProduct,
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

// Actualizar un producto existente
export const updateProduct = async (productId, updatedProduct, brandId, categoryId) => {
  const storedUser = localStorage.getItem('LoggedOrderItAppUser');
  if (!storedUser) throw new Error("No se encontró el usuario autenticado");

  const token = JSON.parse(storedUser);
  if (!token) throw new Error("Token de autenticación no disponible");

  try {
    const response = await axios.put(
      `${API_URL}/${productId}?brandId=${brandId}&categoryId=${categoryId}`,
      updatedProduct,
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


// Eliminar un producto
export const deleteProduct = async (productId) => {
  return await fetchWithAuth(`${API_URL}/${productId}`, {
    method: 'DELETE',
  });
};


// Marcas y categorías
export const brands = {
  ETERNAL: 1,
  PRONTO: 2,
  VALMY: 3,
};

export const categories = [
  { id: 1, name: "Nail Enamels", code: 2060 },
  { id: 2, name: "ETERNAL ACETONE", code: 2000 },
  { id: 3, name: "ETERNAL DROPPER", code: 2004 },
  { id: 4, name: "ETERNAL TREATMENTS", code: 2051 },
  { id: 5, name: "ESSENCIAL KIT", code: 2100 },
  { id: 6, name: "GEL STEP 2", code: 2044 },
];
