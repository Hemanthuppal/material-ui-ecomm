import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { addProduct } from 'src/services/apiProduct'; // Import addProduct function

import { AttachFile as AttachFileIcon } from '@mui/icons-material';
import { Grid, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';

export default function AddProductForm({ onClose, onAddProduct }) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleAddNewProduct = async () => {
    try {
      // Validate form fields
      if (!productName || !quantity || !price || !image) {
        alert('Please fill in all fields');
        return;
      }
  
      // Ensure quantity is defined before parsing
      const parsedQuantity = quantity ? parseInt(quantity, 10) : 0;
  
      // Ensure price is defined before parsing
      const parsedPrice = price ? parseFloat(price) : 0;
  
      // Create new product object
      const newProduct = {
        productName,
        quantity: parsedQuantity,
        price: parsedPrice,
        image, // Assuming image is a file object
      };
  
      // Call addProduct function to add the product to the API
      const addedProduct = await addProduct(newProduct);
  
      // Pass the added product to the parent component
      onAddProduct(addedProduct);
  
      // Clear form fields
      setProductName('');
      setQuantity('');
      setPrice('');
      setImage(null);
  
      // Close the form
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again later.');
    }
  };
  
  

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Update image state with the selected file
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Add Product
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Product Name"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Quantity"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Price"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Upload Image"
          fullWidth
          value={image ? image.name : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton component="label" htmlFor="contained-button-file" edge="end">
                  <AttachFileIcon />
                  <input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleAddNewProduct}>
          Add
        </Button>
        <Button variant="outlined" onClick={onClose} style={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}

AddProductForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};
