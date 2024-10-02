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
  MenuItem as MuiMenuItem, // Renombramos para evitar conflicto con MenuItem
  FormControl,
  InputLabel,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icono de tres puntos
import AddIcon from "@mui/icons-material/Add";
import { getProducts, deleteProduct } from "../../services/productService.js"; // Importa deleteProduct
import AddProductForm from "./AddProduct.jsx"; // Importa el formulario para agregar productos
import EditProductForm from "./EditProduct.jsx"; // Importa el formulario para editar productos

// Lista de categorías por defecto (esto debería venir de tu API o estado global)
const categories = [
  { id: 1, name: "Nail Enamels" },
  { id: 2, name: "ETERNAL ACETONE" },
  { id: 3, name: "ETERNAL DROPPER" },
  { id: 4, name: "ETERNAL TREATMENTS" },
  { id: 5, name: "ESSENCIAL KIT" },
  { id: 6, name: "GEL STEP 2" },
];

// Lista de productos por defecto
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
  const [products, setProducts] = useState(defaultProducts); // Estado inicial de productos
  const [filteredProducts, setFilteredProducts] = useState(defaultProducts); // Productos filtrados
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [open, setOpen] = useState(false); // Estado para el diálogo de confirmación
  const [error, setError] = useState(null); // Estado para manejar errores
  const [addProductOpen, setAddProductOpen] = useState(false); // Estado para abrir el formulario de agregar productos
  const [editProductOpen, setEditProductOpen] = useState(false); // Estado para abrir el formulario de editar productos
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para almacenar el producto seleccionado para edición
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada

  // Lógica para obtener productos al cargar el componente
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData); // Actualiza los productos
      setFilteredProducts(productsData); // También establece los productos filtrados
    } catch (error) {
      setError(error.message); // Maneja errores
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Maneja el cambio de categoría
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    // Filtra productos según la categoría seleccionada
    const filtered = products.filter(product => product.category.categoryId === categoryId);
    setFilteredProducts(filtered);
  };

  const handleClickMenu = (event, product) => {
    setCurrentProductId(product.productId);
    setSelectedProduct(product);
    setAnchorEl(event.currentTarget); // Abre el menú al hacer clic en los tres puntos
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Cierra el menú
  };

  const handleDeleteClick = () => {
    setOpen(true); // Abre el diálogo de confirmación
    handleCloseMenu(); // Cierra el menú
  };

  const handleCloseDialog = () => {
    setOpen(false); // Cierra el diálogo de confirmación
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(currentProductId); // Elimina el producto usando el servicio
      setProducts(products.filter(product => product.productId !== currentProductId)); // Filtra el producto eliminado de la lista
      setOpen(false); // Cierra el diálogo de confirmación
    } catch (error) {
      setError(error.message); // Maneja errores de la eliminación
      setOpen(false); // Cierra el diálogo aunque haya un error
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null); // Resetea el producto seleccionado para añadir
    setAddProductOpen(true); // Abre el formulario de agregar productos
  };

  const handleEditProduct = () => {
    setEditProductOpen(true); // Abre el formulario de editar productos
    handleCloseMenu(); // Cierra el menú
  };

  const handleCloseAddProductForm = () => {
    setAddProductOpen(false); // Cierra el formulario de agregar productos
    fetchProducts(); // Vuelve a cargar la lista de productos
  };

  const handleCloseEditProductForm = () => {
    setEditProductOpen(false); // Cierra el formulario de editar productos
    fetchProducts(); // Vuelve a cargar la lista de productos
  };

  if (error) {
    return <div>Error: {error}</div>; // Muestra el error si lo hay
  }

  return (
    <Box sx={{ padding: 2, position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Products List
      </Typography>

      {/* Selector de Categoría */}
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

      {/* Lista de productos filtrados */}
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

      {/* Menú desplegable para Modificar y Eliminar */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditProduct}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      {/* Diálogo de Confirmación para Eliminar */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
      >
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

      {/* Formulario para Agregar Producto */}
      <Dialog open={addProductOpen} onClose={handleCloseAddProductForm}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <AddProductForm 
            onClose={handleCloseAddProductForm} 
          />
        </DialogContent>
      </Dialog>

      {/* Formulario para Editar Producto */}
      <Dialog open={editProductOpen} onClose={handleCloseEditProductForm}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <EditProductForm 
            product={selectedProduct} 
            onClose={handleCloseEditProductForm} 
          />
        </DialogContent>
      </Dialog>

      {/* Botón para Agregar Producto */}
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
    </Box>
  );
}
