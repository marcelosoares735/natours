/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async function (data, type) {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:8000/api/v1/users/update-password'
        : 'http://127.0.0.1:8000/api/v1/users/update-me';
    const res = await axios({
      method: 'patch',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
