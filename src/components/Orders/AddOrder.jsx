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
import { createOrder } from "../../services/orderServices";

export default function AddOrderForm() {
  const [poNumber, setPoNumber] = useState("");
  const [total, setTotal] = useState("");
  const [storeId, setStoreId] = useState("");
  const [salespersonId, setSalespersonId] = useState("");

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crea la nueva orden
    const newOrder = {
      poNumber,
      total,
      isActive: true, // Puedes cambiar este valor según el estado de la orden
    };

    try {
      // Llama al servicio para crear la orden, enviando storeId y salespersonId como parámetros de consulta
      await createOrder(newOrder, storeId, salespersonId);
      alert("Order created successfully!");
      // Limpiar el formulario después de la creación
      setPoNumber("");
      setTotal("");
      setStoreId("");
      setSalespersonId("");
    } catch (error) {
      alert(`Error creating order: ${error.message}`);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="PO Number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Total"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        {/* Select para Tiendas */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="store-label">Store</InputLabel>
          <Select
            labelId="store-label"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            label="Store"
          >
            {/* Aquí puedes agregar las tiendas de forma estática o dinámica */}
            <MenuItem value="1">Store 1</MenuItem>
            <MenuItem value="2">Store 2</MenuItem>
          </Select>
        </FormControl>

        {/* Select para Vendedores */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="salesperson-label">Salesperson</InputLabel>
          <Select
            labelId="salesperson-label"
            value={salespersonId}
            onChange={(e) => setSalespersonId(e.target.value)}
            label="Salesperson"
          >
            <MenuItem value="1">Salesperson 1</MenuItem>
            <MenuItem value="2">Salesperson 2</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Add Order
        </Button>
      </form>
    </Box>
  );
}
