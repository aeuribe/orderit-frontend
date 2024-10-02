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
  Fab,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { getProducts, deleteProduct } from "../../services/productService.js";
import AddProductForm from "./AddProduct.jsx";
import EditProductForm from "./EditProduct.jsx";

const categories = [
  { id: 1, name: "Nail Enamels" },
  { id: 2, name: "ETERNAL ACETONE" },
  { id: 3, name: "ETERNAL DROPPER" },
  { id: 4, name: "ETERNAL TREATMENTS" },
  { id: 5, name: "ESSENCIAL KIT" },
  { id: 6, name: "GEL STEP 2" },
];

const defaultProducts = [
  {
    productId: 258,
    name: "CRAZY VIOLET",
    description: "Vivid violet for the wild at heart",
    size: "0.46 OZ",
    isActive: true,
    brand: { brandId: 1, name: "Eternal" },
    category: { categoryId: 1, name: "Nail Enamels", code: 2060 },
  },
];

export default function Products() {
  const [products, setProducts] = useState(defaultProducts);
  const [filteredProducts, setFilteredProducts] = useState(defaultProducts);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    const filtered = products.filter(
      (product) => product.category.categoryId === categoryId
    );
    setFilteredProducts(filtered);
  };

  const handleClickMenu = (event, product) => {
    setCurrentProductId(product.productId);
    setSelectedProduct(product);
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

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(currentProductId);
      setProducts(products.filter((product) => product.productId !== currentProductId));
      setFilteredProducts(filteredProducts.filter((product) => product.productId !== currentProductId));
      setOpen(false);
      setOpenSnackbar(true); // Muestra el snackbar de éxito
    } catch (error) {
      setError(error.message);
      setOpen(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setAddProductOpen(true);
  };

  const handleEditProduct = () => {
    setEditProductOpen(true);
    handleCloseMenu();
  };

  const handleCloseAddProductForm = () => {
    setAddProductOpen(false);
    fetchProducts();
  };

  const handleCloseEditProductForm = () => {
    setEditProductOpen(false);
    fetchProducts();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ padding: 2, position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Products List
      </Typography>

      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Category"
        >
          <MuiMenuItem value="">
            <em>All Categories</em>
          </MuiMenuItem>
          {categories.map((category) => (
            <MuiMenuItem key={category.id} value={category.id}>
              {category.name}
            </MuiMenuItem>
          ))}
        </Select>
      </FormControl>

      <List>
        {filteredProducts.map((product) => (
          <ListItem
            key={product.productId}
            sx={{
              boxShadow: 2,
              marginBottom: 1,
              borderRadius: 1,
              transition: "transform 0.3s ease",
            }}
          >
            <ListItemText
              primary={product.name}
              secondary={`${product.brand.name} -  ${product.category.name} -  ${product.size}`}
            />
            <IconButton
              onClick={(event) => handleClickMenu(event, product)}
              sx={{ marginLeft: "auto" }}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEditProduct}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
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

      <Dialog open={addProductOpen} onClose={handleCloseAddProductForm}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <AddProductForm onClose={handleCloseAddProductForm} />
        </DialogContent>
      </Dialog>

      <Dialog open={editProductOpen} onClose={handleCloseEditProductForm}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <EditProductForm product={selectedProduct} onClose={handleCloseEditProductForm} />
        </DialogContent>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddProduct}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Snackbar para el mensaje de éxito */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message="Producto eliminado satisfactoriamente"
      />
    </Box>
  );
}
