import axios from 'axios';
import Router from 'next/router';
import { message } from 'antd';
import { URL } from '../config.json';

export default class ProductService {
  constructor(domain) {
    this.domain = domain || URL;
  }

  getProducts = async () => {
    try {
      const res = await axios.get(`${URL}/products`, {
        params: {
          limit: 16,
          offset: 0,
          search: {
            p_status: 1,
          },
        },
      });
      return {
        msg: 'success',
        success: true,
        rows: res.data.rows,
        count: res.data.count,
      };
    } catch (e) {
      console.log(e);
      return {
        msg: e.message,
        success: false,
        rows: [],
        count: 0,
      };
    }
  };

  getProductOne = async id => {
    try {
      const res = await axios.get(`${URL}/product`, {
        params: {
          p_id: id,
        },
      });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };
}
