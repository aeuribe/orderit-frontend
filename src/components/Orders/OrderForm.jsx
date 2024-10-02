import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { createOrder } from "../../services/orderServices.js";
import { createOrderDetail } from "../../services/orderDetailService.js";
import { getProducts } from "../../services/productService.js";
import { getStores } from "../../services/storeServices.js";
import decodeService from "../../services/decodeToken.js";
import DeleteIcon from "@mui/icons-material/Delete";

const OrderForm = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  const [poNumber, setPoNumber] = useState("");
  const [totale, setTotal] = useState(0); // Inicializa el total en 0
  const [storeId, setStoreId] = useState("");
  const [salespersonId, setSalespersonId] = useState("");
  const orderDate = new Date().toISOString();
  
  useEffect(() => {
    const fetchStores = async () => {
      const storesData = await getStores();
      setStores(storesData);
    };

    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    const fetchSalesperson = () => {
      const token = decodeService.decodeToken(
        localStorage.getItem("LoggedOrderItAppUser")
      );
      const salesperson = token.SalespersonId;
      setSalespersonId(salesperson);
    };

    fetchStores();
    fetchProducts();
    fetchSalesperson();
  }, []);

  const handleAddDetail = () => {
    if (selectedProduct && quantity > 0) {
      const productExists = orderDetails.some(
        (detail) => detail.productId === selectedProduct.productId
      );
      if (!productExists) {
        const productDetail = {
          productId: selectedProduct.productId,
          productName: selectedProduct.name,
          quantity: Number(quantity), // Aseguramos que sea número
        };
        setOrderDetails((prevDetails) => [...prevDetails, productDetail]);
        setTotal((prevTotal) => prevTotal + Number(quantity)); // Suma directamente al total

        setSelectedProduct(null);
        setQuantity(""); // Limpia la cantidad después de añadir el producto
      } else {
        alert("Product already added to the order.");
      }
    } else {
      alert("Please select a product and enter a valid quantity.");
    }
  };

  const handleRemoveDetail = (productId, quantity) => {
    const updatedOrderDetails = orderDetails.filter(
      (detail) => detail.productId !== productId
    );
    setOrderDetails(updatedOrderDetails);
    setTotal((prevTotal) => prevTotal - quantity); // Resta directamente del total
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStore || orderDetails.length === 0) {
      alert("Please select a store and add at least one product to the order.");
      return;
    }

    try {
      const token = decodeService.decodeToken(
        localStorage.getItem("LoggedOrderItAppUser")
      );
      const salespersonId = token.SalespersonId;
      const storeId = selectedStore;

      const newOrder = {
        poNumber,
        date: orderDate,
        status: 1,
        total: totale,
        store: { storeId, name: "string", type: "string", address: "string" },
        salesperson: {
          salespersonId,
          userId: "string",
          firstName: "string",
          secondName: "string",
          lastName: "string",
          secondLastName: "string",
        },
      };
      const newOrderResponse = await createOrder(
        newOrder,
        storeId,
        salespersonId
      );
      const { orderId } = newOrderResponse;

      for (const detail of orderDetails) {
        const orderDetail = {
          quantity: detail.quantity,
        };
        await createOrderDetail(orderId, detail.productId, orderDetail);
      }

      alert("Order created successfully!");
      setPoNumber("");
      setOrderDetails([]);
      setSelectedStore("");
      setTotal(0); // Reiniciar el total
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating the order. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create Order
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="store-select-label">Select Store</InputLabel>
        <Select
          labelId="store-select-label"
          value={selectedStore}
          onChange={(e) => {
            setSelectedStore(e.target.value);
            setStoreId(e.target.value);
          }}
        >
          {stores.map((store) => (
            <MenuItem key={store.storeId} value={store.storeId}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="PO Number"
        value={poNumber}
        onChange={(e) => setPoNumber(e.target.value)}
        margin="normal"
      />
      <Autocomplete
        options={products}
        getOptionLabel={(option) => option.name}
        value={selectedProduct}
        onChange={(event, newValue) => setSelectedProduct(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Product"
            variant="outlined"
            margin="normal"
          />
        )}
        fullWidth
      />
      <TextField
        fullWidth
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        margin="normal"
        inputProps={{ min: 1 }}
      />
      <Button
        variant="contained"
        onClick={handleAddDetail}
        sx={{ marginBottom: 2 }}
      >
        Add Product
      </Button>
      <Typography variant="h6">Order Details</Typography>
      <List>
        {orderDetails.map((detail, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() =>
                  handleRemoveDetail(detail.productId, detail.quantity)
                }
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${detail.productName} - Quantity: ${detail.quantity}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="h6" gutterBottom>
        Total Quantity: {totale}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        Create Order
      </Button>
    </Box>
  );
};

export default OrderForm;
