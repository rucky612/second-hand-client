import React from 'react';
import App, { Container } from 'next/app';
import Frame from '../components/layout/Frame';
import AuthService from '../utils/AuthService';
import URL from '../constants/route-url';

const Auth = new AuthService();

const headerList = [
  { ...URL.SHOP },
  { ...URL.CART },
  { ...URL.MYPAGE },
  { ...URL.LOGOUT, onClick: Auth.logout },
];

const authHeaderList = [
  { ...URL.SHOP },
  { ...URL.LOGIN },
  { ...URL.SINGUP },
];

class MyApp extends App {
  static async getInitialProps(appContext) {
    // your login in here
    const appProps = await App.getInitialProps(appContext);
    const { tokenAuth } = appProps.pageProps;
    const list = tokenAuth ? headerList : authHeaderList;
    const cloneApp = {
      ...appProps,
      pageProps: { ...appProps.pageProps, list },
    };
    return { ...cloneApp };
  }

  render() {
    const { pageProps, Component } = this.props;
    const { list } = pageProps;
    return (
      <Container>
        <Frame list={list}>
          <Component {...pageProps} />
        </Frame>
      </Container>
    );
  }
}

export default MyApp;
