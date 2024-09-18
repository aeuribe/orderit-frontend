import {jwtDecode} from 'jwt-decode'

const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        // Manejo de errores
        console.error("Error decoding token", error);
        throw error;
    }
}

export default {decodeToken};