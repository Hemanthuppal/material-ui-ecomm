import axios from 'axios';

import { CUSTOMERS_URL } from './apiUrls';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(CUSTOMERS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${CUSTOMERS_URL}/${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(CUSTOMERS_URL, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const editUser = async (userId, updatedUserData) => {
  try {
    const response = await axios.put(`${CUSTOMERS_URL}/${userId}`, updatedUserData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing user:', error);
    throw error;
  }
};
