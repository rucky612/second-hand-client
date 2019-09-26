import axios from 'axios';
import { URL } from '../config.json';

export default class OrderService {
  constructor(domain) {
    this.domain = domain || URL;
  }

  postUser = async user => {
    try {
      await axios.post(`${URL}/user`, {
        ...user,
      });
      return {
        msg: 'success',
        success: true,
      };
    } catch (e) {
      return {
        msg: e.message,
        success: false,
      };
    }
  };

  putUser = async (token, user) => {
    try {
      await axios.put(`${URL}/auth/user`, {
        token,
        ...user,
      });
      return {
        msg: 'success',
        success: true,
      };
    } catch (e) {
      return {
        msg: e.message,
        success: false,
      };
    }
  };

  getUser = async token => {
    try {
      const res = await axios.get(`${URL}/auth/user`, {
        params: {
          token,
        },
      });
      return {
        msg: 'success',
        success: true,
        user: res.data[0],
      };
    } catch (e) {
      return {
        msg: e.message,
        success: false,
      };
    }
  };
}
