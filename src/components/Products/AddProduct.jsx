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
import { createProduct, brands, categories } from "../../services/productService.js";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crea el nuevo producto
    const newProduct = {
      name,
      description,
      color,
      size,
      weight,
      imageUrl,
      isActive: true, // Puedes cambiar este valor según el estado del producto
    };

    try {
      // Llama al servicio para crear el producto, enviando brandId y categoryId como parámetros de consulta
      await createProduct(newProduct, brandId, categoryId);
      alert("Product created successfully!");
      // Limpiar el formulario después de la creación
      setName("");
      setDescription("");
      setColor("");
      setSize("");
      setWeight("");
      setImageUrl("");
      setBrandId("");
      setCategoryId("");
    } catch (error) {
      alert(`Error creating product: ${error.message}`);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Product
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
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Select para Marcas */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="brand-label">Brand</InputLabel>
          <Select
            labelId="brand-label"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            label="Brand"
          >
            {Object.entries(brands).map(([name, id]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select para Categorías */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Add Product
        </Button>
      </form>
    </Box>
  );
}
    