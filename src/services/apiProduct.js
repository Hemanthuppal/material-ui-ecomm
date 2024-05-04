import axios from 'axios';

import { PRODUCTS_URL } from './apiUrls'; // Assuming you have a variable for the products URL

export const fetchProducts = async () => {
  try {
    const response = await axios.get(PRODUCTS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${PRODUCTS_URL}/${productId}`);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(PRODUCTS_URL, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const editProduct = async (productId, updatedProductData) => {
  try {
    const response = await axios.put(`${PRODUCTS_URL}/${productId}`, updatedProductData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing product:', error);
    throw error;
  }
};
