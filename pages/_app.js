import React from 'react';
import App from 'next/app';
import Frame from '../components/layout/Frame';
import AuthService from '../utils/AuthService';
import URL from '../constants/route-url';
import Router from 'next/router';

const Auth = new AuthService();

const headerList = [
  { ...URL.SHOP },
  { ...URL.CART },
  { ...URL.MYPAGE },
  { ...URL.LOGOUT, onClick: Auth.logout },
];

const authHeaderList = [{ ...URL.SHOP }, { ...URL.LOGIN }, { ...URL.SINGUP }];

const menuUrl = [{ ...URL.HOME }, { ...URL.SHOP.ID }, { ...URL.SHOP }];

class MyApp extends App {
  static async getInitialProps(appContext) {
    // your login in here
    const appProps = await App.getInitialProps(appContext);
    const tokenAuth = await Auth.loggedIn(appContext.ctx.req);
    const path = appContext.ctx.pathname || Router.pathname;
    const openURL = tokenAuth
      ? [
          ...menuUrl,
          { ...URL.CART },
          { ...URL.ORDER },
          { ...URL.MYPAGE },
          { ...URL.MYPAGE.MODIFY },
        ]
      : [...menuUrl, { ...URL.LOGIN }, { ...URL.SINGUP }];
    const checkUrl = openURL.some(item => item.link === path);
    if (!tokenAuth && !checkUrl) {
      if (appContext.ctx.res) {
        appContext.ctx.res.writeHead(302, {
          Location: URL.LOGIN.link,
        });
        appContext.ctx.res.end();
      } else {
        Router.replace(URL.LOGIN.link);
      }
    }
    if (tokenAuth && !checkUrl) {
      if (appContext.ctx.res) {
        appContext.ctx.res.writeHead(302, {
          Location: URL.HOME.link,
        });
        appContext.ctx.res.end();
      } else {
        Router.replace(URL.HOME.link);
      }
    }
    const cloneApp = {
      ...appProps,
      pageProps: { ...appProps.pageProps, tokenAuth },
    };
    return { ...cloneApp };
  }

  render() {
    const { pageProps, Component } = this.props;
    const list = pageProps.tokenAuth ? headerList : authHeaderList;
    const compProps = { ...pageProps };
    return (
      <Frame list={list}>
        <Component {...compProps} />
      </Frame>
    );
  }
}

export default MyApp;
