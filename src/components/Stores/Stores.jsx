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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icono de tres puntos
import AddIcon from "@mui/icons-material/Add";
import { getStores, deleteStore } from "../../services/storeServices.js";
import AddStoreForm from "./AddStore.jsx"; // Importa el formulario para agregar tiendas
import EditStoreForm from "./EditStore.jsx"; // Importa el formulario para editar tiendas

// Lista de stores por defecto
const defaultStores = [
  {
    storeId: 100,
    name: "Farmatodo",
    description: "Farmatodo Las Mercedes",
    type: "Farmatodo",
    address: "Las Mercedes, Calle Paris",
  },
];

export default function Stores() {
  const [stores, setStores] = useState(defaultStores); // Estado inicial de stores
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [open, setOpen] = useState(false); // Estado para el diálogo de confirmación
  const [error, setError] = useState(null); // Estado para manejar errores
  const [addStoreOpen, setAddStoreOpen] = useState(false); // Estado para abrir el formulario de agregar tiendas
  const [editStoreOpen, setEditStoreOpen] = useState(false); // Estado para abrir el formulario de editar tiendas
  const [selectedStore, setSelectedStore] = useState(null); // Estado para almacenar el tiendas seleccionado para edición

  // Lógica para obtener tiendas al cargar el componente
  const fetchStores = async () => {
    try {
      const storesData = await getStores();
      setStores(storesData); // Actualiza los tiendas
    } catch (error) {
      setError(error.message); // Maneja errores
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleClickMenu = (event, store) => {
    setCurrentStoreId(store.storeId);
    setSelectedStore(store);
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
      await deleteStore(currentStoreId); // Elimina la tienda usando el servicio
      setStores(stores.filter((store) => store.storeId !== currentStoreId)); // Filtra la tienda eliminado de la lista
      setOpen(false); // Cierra el diálogo de confirmación
    } catch (error) {
      setError(error.message); // Maneja errores de la eliminación
      setOpen(false); // Cierra el diálogo aunque haya un error
    }
  };

  const handleAddStore = () => {
    setSelectedStore(null); // Resetea la tienda seleccionado para añadir
    setAddStoreOpen(true); // Abre el formulario de agregar tiendas
  };

  const handleEditStore = () => {
    setEditStoreOpen(true); // Abre el formulario de editar tiendas
    handleCloseMenu(); // Cierra el menú
  };

  const handleCloseAddStoreForm = () => {
    setAddStoreOpen(false); // Cierra el formulario de agregar tiendas
    fetchStores(); // Vuelve a cargar la lista de tiendass
  };

  const handleCloseEditStoreForm = () => {
    setEditStoreOpen(false); // Cierra el formulario de editar tiendas
    fetchStores(); // Vuelve a cargar la lista de tiendas
  };

  if (error) {
    return <div>Error: {error}</div>; // Muestra el error si lo hay
  }

  return (
    <Box sx={{ padding: 2, position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Stores List
      </Typography>

      {/* Lista de tiendas */}
      <List>
        {stores.map((store) => (
          <ListItem
            key={store.storeId}
            sx={{
              boxShadow: 2,
              marginBottom: 1,
              borderRadius: 1,
              transition: "transform 0.3s ease",
            }}
          >
            <ListItemText
              primary={store.name}
              secondary={
                <>
                  {store.type}
                  <br />
                  {store.address}
                </>
              }
            />
            <IconButton
              onClick={(event) => handleClickMenu(event, store)}
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
        <MenuItem onClick={handleEditStore}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      {/* Diálogo de Confirmación para Eliminar */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Delete Store</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this store? This action cannot be
            undone.
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

      {/* Formulario para Agregar Tienda */}
      <Dialog open={addStoreOpen} onClose={handleCloseAddStoreForm}>
        <DialogTitle>Add New Store</DialogTitle>
        <DialogContent>
          <AddStoreForm
            onClose={handleCloseAddStoreForm}
            setStores={setStores}
          />
        </DialogContent>
      </Dialog>

      {/* Formulario para Editar Tienda */}
      <Dialog open={editStoreOpen} onClose={handleCloseEditStoreForm}>
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
          <EditStoreForm
            storeId={selectedStore?.storeId} // Pasa el ID de la tienda seleccionada
            onClose={handleCloseEditStoreForm}
            setStores={setStores}
          />
        </DialogContent>
      </Dialog>

      {/* Botón Flotante para Agregar Nueva Tienda */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 1000,
        }}
        onClick={handleAddStore}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
