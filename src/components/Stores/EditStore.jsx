import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { getStoreById, updateStore } from "../../services/storeServices";

export default function EditStoreForm({ storeId, onClose, setStores }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");

  // Lógica para obtener la tienda al cargar el componente
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const store = await getStoreById(storeId);
        setName(store.name);
        setDescription(store.description);
        setType(store.type);
        setAddress(store.address);
      } catch (error) {
        alert(`Error fetching store: ${error.message}`);
      }
    };

    fetchStore();
  }, [storeId]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedStore = {
      name,
      description,
      type,
      address
    };

    try {
      await updateStore(storeId, updatedStore); // Actualiza la tienda
      alert("Store updated successfully!");
      onClose(); // Cierra el formulario
    } catch (error) {
      alert(`Error updating store: ${error.message}`);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Store
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)} 
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}  
          fullWidth
          margin="normal"
          required
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Update Store
        </Button>
      </form>
    </Box>
  );
}
