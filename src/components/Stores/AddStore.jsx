import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import {createStore} from "../../services/storeServices";

export default function AddStoreForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");


  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crea la nueva tienda
    const newStore = {
      name,
      type,
      address
    };

    try {
      // Llama al servicio para crear la tienda
      await createStore(newStore);
      alert("Store created successfully!");
      // Limpiar el formulario después de la creación
      setName("");
      setDescription("");
      setType("");
      setAddress("");
    } catch (error) {
      alert(`Error creating store: ${error.message}`);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Store
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
          Add Store
        </Button>
      </form>
    </Box>
  );
}
    