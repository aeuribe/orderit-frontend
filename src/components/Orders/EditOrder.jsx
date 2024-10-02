import React, { useState, useEffect } from "react";
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
import { getOrderById, updateOrder } from "../../services/orderServices.js";

export default function EditOrderForm({ orderId, onClose, setOrders }) {
  const [poNumber, setPoNumber] = useState("");
  const [total, setTotal] = useState("");
  const [storeId, setStoreId] = useState("");
  const [salespersonId, setSalespersonId] = useState("");

  // Lógica para obtener la orden al cargar el componente
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await getOrderById(orderId);
        setPoNumber(order.poNumber);
        setTotal(order.total);
        setStoreId(order.storeId);
        setSalespersonId(order.salespersonId);
      } catch (error) {
        alert(`Error fetching order: ${error.message}`);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedOrder = {
      orderId,
      poNumber,
      total,
      isActive: true, // Puedes cambiar este valor según el estado de la orden
    };

    try {
      await updateOrder(orderId, updatedOrder, storeId, salespersonId); // Actualiza la orden
      alert("Order updated successfully!");
      onClose(); // Cierra el formulario
    } catch (error) {
      alert(`Error updating order: ${error.message}`);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Order
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
            {/* Aquí puedes agregar los vendedores de forma estática o dinámica */}
            <MenuItem value="1">Salesperson 1</MenuItem>
            <MenuItem value="2">Salesperson 2</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Update Order
        </Button>
      </form>
    </Box>
  );
}
