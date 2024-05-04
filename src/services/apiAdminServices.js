import axios from 'axios';

import { ADMIN_USERS_URL } from './apiUrls';

export const loginUserAPI = async ({ email, password }) => {
  const response = await axios.get(ADMIN_USERS_URL);
  const users = response.data;
  const user = users.find((a) => a.email === email && a.password === password);
  return user;
};

