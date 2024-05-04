import axios from 'axios';

import { CATEGORIES_URL } from './apiUrls';

export const fetchCategories = async () => {
  try {
    const response = await axios.get(CATEGORIES_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await axios.delete(`${CATEGORIES_URL}/${categoryId}`);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(CATEGORIES_URL, categoryData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const editCategory = async (categoryId, updatedCategoryData) => {
  try {
    const response = await axios.put(`${CATEGORIES_URL}/${categoryId}`, updatedCategoryData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing category:', error);
    throw error;
  }
};
