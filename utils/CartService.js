import axios from 'axios';
import { URL } from '../config.json';

export default class CartService {
  constructor(domain) {
    this.domain = domain || URL;
  }

  postCart = async (pid, token, amount) => {
    try {
      const res = await axios.post(`${URL}/cart`, {
          p_id: pid,
          c_amount: amount,
          token,
      });
      return {
        msg: 'success',
        success: true
      };
    } catch (e) {
      return {
        msg: e.message,
        success: false
      }
    }
  };

  getCarts = async token => {
    try {
      const res = await axios.get(`${URL}/carts`, {
        params: {
          token
        },
      });
      return {
        msg: 'success',
        success: true,
        rows: res.data.rows,
        count: res.data.count
      };
    } catch (e) {
      return {
        msg: e.message,
        success: false,
        rows: [],
        count: null
      }
    }
  };

  deleteCart = async c_id => {
    try {
      await axios.delete(`${URL}/cart`, {
        params: {
          c_id
        },
      });
      return {
        msg: 'success',
        success: true,
      };
    } catch (e) {
      return {
        msg: e.message,
        success: false,
      }
    }
  };
}
