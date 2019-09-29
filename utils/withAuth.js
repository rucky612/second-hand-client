import React from 'react';
import Router from 'next/router';
import AuthService from './AuthService.js';
import URL from '../constants/route-url';

// const Auth = new AuthService();

// const menuUrl = [{ ...URL.HOME }, { ...URL.SHOP.ID }, { ...URL.SHOP }];

export default function WithContainer(Component) {
  return class WithContainer extends React.Component {
    static async getInitialProps(ctx) {
      const pageProps =
        Component.getInitialProps !== undefined
          ? await Component.getInitialProps(ctx)
          : {};
      // const tokenAuth = await Auth.loggedIn(ctx.req);
      // const path = ctx.pathname || Router.pathname;
      // const openURL = tokenAuth
      //   ? [...menuUrl]
      //   : [...menuUrl, { ...URL.LOGIN }, { ...URL.SINGUP }];
      // const checkUrl = openURL.some(item => item.link === path);
      // if (!tokenAuth && !checkUrl) {
      //   if (ctx.res) {
      //     ctx.res.writeHead(302, {
      //       Location: URL.LOGIN.link,
      //     });
      //     ctx.res.end();
      //   } else {
      //     Router.replace(URL.LOGIN.link);
      //   }
      // }
      return { ...pageProps };
    }

    // componentDidMount() {
    //   const { tokenAuth } = this.props;
    //   const openURL = tokenAuth
    //     ? [...menuUrl]
    //     : [...menuUrl, { ...URL.LOGIN }, { ...URL.SINGUP }];
    //   const checkUrl = openURL.some(item => item.link === Router.pathname);
    //   console.log(tokenAuth, checkUrl);
    //   if (!tokenAuth && !checkUrl) {
    //     Router.replace(URL.LOGIN.link);
    //   }
    //   if (tokenAuth && !checkUrl) {
    //     Router.replace(URL.HOME.link);
    //   }
    // }

    render() {
      return <Component {...this.props} />;
    }
  };
}
