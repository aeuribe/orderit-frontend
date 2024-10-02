import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Divider,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { getOrders, getOrdersBySalesperson } from "../../services/orderServices.js";
import { getOrdersDetailByOrderId } from "../../services/orderDetailService.js"; 
import AddOrderForm from "./AddOrder.jsx";
import EditOrderForm from "./EditOrder.jsx";
import OrderForm from "./OrderForm.jsx";
import decodeService from "../../services/decodeToken.js";

const defaultOrders = [];

export default function Orders() {
  const [orders, setOrders] = useState(defaultOrders);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [addOrderOpen, setAddOrderOpen] = useState(false);
  const [editOrderOpen, setEditOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [orderDetails, setOrderDetails] = useState(""); // Estado para manejar detalles de la orden

  useEffect(() => {
    if (orderDetails) {
      console.log("Order details updated:", orderDetails);
    }
  }, [orderDetails]); 

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('LoggedOrderItAppUser');
      const storedUser = decodeService.decodeToken(token);
      console.log("desde orders: "+ storedUser.SalespersonId)
      const ordersData = await getOrdersBySalesperson(storedUser.SalespersonId);
      const ordersWithStatus = ordersData.map(order => ({
        ...order,
        status: 'Pending', 
      }));
      setOrders(ordersWithStatus);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleClickMenu = (event, order) => {
    setCurrentOrderId(order.orderId);
    setSelectedOrder(order);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    setOrders(orders.filter(order => order.orderId !== currentOrderId));
    setOpen(false);
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setAddOrderOpen(true);
  };

  const handleEditOrder = () => {
    setEditOrderOpen(true);
    handleCloseMenu();
  };

  const handleCloseAddOrderForm = () => {
    setAddOrderOpen(false);
    fetchOrders();
  };

  const handleCloseEditOrderForm = () => {
    setEditOrderOpen(false);
    fetchOrders();
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  const handleChangeFilter = (event) => {
    setFilterStatus(event.target.value);
  };

  // Nueva función para obtener y mostrar detalles de la orden
  const handleShowDetails = async (orderId) => {
    try {
      const details = await getOrdersDetailByOrderId(orderId); // Llamada al servicio para obtener los detalles
      setOrderDetails(details);
      console.log(details) // Establece los detalles en el estado
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Función para cerrar los detalles de la orden
  const handleCloseDetails = () => {
    setOrderDetails(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ padding: 2, position: "relative", bgcolor: 'background.default' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Orders List
        </Typography>

        {/* Filtro por estado */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            labelId="filter-status-label"
            value={filterStatus}
            label="Status"
            onChange={handleChangeFilter}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Canceled">Canceled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lista de órdenes */}
      <List>
        {filteredOrders.map((order) => (
          <ListItem
            key={order.orderId}
            sx={{
              border: `1px solid ${order.status === "Completed" ? "#4CAF50" : order.status === "Canceled" ? "#F44336" : "#B0BEC5"}`,
              borderRadius: 1,
              marginBottom: 1,
              padding: 1,
              bgcolor: 'background.paper',
              transition: "border-color 0.3s ease",
              '&:hover': {
                borderColor: '#3A3ABF',
              },
            }}
            onClick={() => handleShowDetails(order.orderId)} // Agregamos el onClick aquí
          >
            <ListItemText
              primary={`Order #${order.poNumber}`}
              secondary={`Store: ${order.store.name} - Salesperson: ${order.salesperson.firstName} ${order.salesperson.lastName} - Total: ${order.total} - Status: ${order.status}`}
              sx={{ typography: 'body2' }}
            />
            <ToggleButtonGroup
              value={order.status}
              exclusive
              onChange={(event, newStatus) => handleStatusChange(order.orderId, newStatus)}
              sx={{ marginLeft: "auto", bgcolor: 'background.default', borderRadius: 1, border: '1px solid #B0BEC5' }}
            >
              <ToggleButton value="Pending" sx={{ color: '#B0BEC5', '&.Mui-selected': { color: '#3A3ABF' } }}>Pending</ToggleButton>
              <ToggleButton value="Completed" sx={{ color: '#B0BEC5', '&.Mui-selected': { color: '#4CAF50' } }}>Completed</ToggleButton>
              <ToggleButton value="Canceled" sx={{ color: '#B0BEC5', '&.Mui-selected': { color: '#F44336' } }}>Canceled</ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              onClick={(event) => handleClickMenu(event, order)}
              sx={{ marginLeft: 1, color: '#B0BEC5' }}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Menú desplegable */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditOrder}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      {/* Diálogo de Confirmación para Eliminar */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulario para Agregar Orden */}
      <Dialog open={addOrderOpen} onClose={handleCloseAddOrderForm}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <OrderForm onClose={handleCloseAddOrderForm} setOrders={setOrders} />
        </DialogContent>
      </Dialog>

      {/* Formulario para Editar Orden */}
      <Dialog open={editOrderOpen} onClose={handleCloseEditOrderForm}>
    <DialogTitle>Edit Order</DialogTitle>
    <DialogContent>
      <EditOrderForm order={selectedOrder} onClose={handleCloseEditOrderForm} />
    </DialogContent>
  </Dialog>

  {/* Mostrar detalles de la orden */}
<Dialog open={!!orderDetails && orderDetails.length > 0} onClose={handleCloseDetails}>
  <DialogTitle>Order Details</DialogTitle>
  <DialogContent>
    {orderDetails && orderDetails.length > 0 ? (
      <div>
        {/* Muestra los detalles de la orden aquí */}
        {orderDetails.map((detail) => (
          <div key={detail.orderDetailId}>
            <Typography variant="h6">Order Detail ID: {detail.orderDetailId}</Typography>
            <Typography variant="body1">Product Name: {detail.product.name}</Typography>
            <Typography variant="body1">Quantity: {detail.quantity}</Typography>
            {/* Agrega más campos según sea necesario */}
            <Divider style={{ margin: "10px 0" }} />
          </div>
        ))}
      </div>
    ) : (
      <Typography variant="body2">Loading details...</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDetails} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

<Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 1000,
        }}
        onClick={handleAddOrder}
      >
        <AddIcon />
      </Fab>
</Box>
); }