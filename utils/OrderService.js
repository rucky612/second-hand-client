import axios from 'axios';
import { URL } from '../config.json';

export default class OrderService {
  constructor(domain) {
    this.domain = domain || URL;
  }

  getOrders = async (token) => {
    try {
      const res = await axios.get(`${URL}/auth/order`, {
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
      console.log({e})
      return {
        msg: e.message,
        success: false,
        rows: [],
        count: 0
      }
    }
  };

  postOrders = async (token, orders) => {
    try {
      await axios.post(`${URL}/order`, {
        orders,
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

}
