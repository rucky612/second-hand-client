import axios from 'axios';
import { Cookies } from 'react-cookie';
import Router from 'next/router';
import { message } from 'antd';
import { URL } from '../config.json';

const cookies = new Cookies();

export default class AuthService {
  constructor(domain) {
    this.domain = domain || URL;
  }

  setToken = token => {
    const exdate = new Date();
    const expire = 1;
    exdate.setDate(exdate.getDate() + expire);
    axios.defaults.headers.common = { 'x-access-token': token };
    cookies.set('token', token);
  };

  getToken = req => {
    // Retrieves the user token from cookie
    if (req && req.headers.cookie) {
      return req.headers.cookie
        ? req.headers.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
            '$1',
          )
        : false;
    } else {
      return cookies.get('token');
    }
  };

  isTokenExpired = token => {
    return axios
      .get(`${this.domain}/auth/token`, {
        params: {
          token,
        },
      })
      .then(res => {
        console.log('token success');
        return true;
      })
      .catch(err => {
        console.log('token expired');
        return false;
      });
  };

  login = async (id, pwd) => {
    // Get a token
    const user = {
      u_name: id,
      u_password: pwd,
    };
    try {
      const res = await axios.post(`${this.domain}/auth/login`, user);
      this.setToken(res.data.token);
      return true;
    } catch (e) {
      // message.error('아이디 또는 비밀번호를 확인해주세요.', 3);
      console.log({ e });
      return false;
    }
  };

  loggedIn = async req => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(req);
    const tokenExpired = await this.isTokenExpired(token);
    return !!token && tokenExpired; // handwaiving here
  };

  logout = () => {
    // Clear user token and profile data from cookie
    cookies.remove('token');
  };
}
