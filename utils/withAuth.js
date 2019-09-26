import React from 'react';
import Router from 'next/router';
import AuthService from './AuthService.js';
import URL from '../constants/route-url';

const Auth = new AuthService();

const openUrl = [
  { ...URL.HOME },
  { ...URL.SHOP.ID },
  { ...URL.SHOP },
  { ...URL.LOGIN },
  { ...URL.SINGUP },
];

export default function WithContainer(Component) {
  return class WithContainer extends React.Component {
    static async getInitialProps(ctx) {
      // your login in here
      const pageProps =
        Component.getInitialProps !== undefined
          ? await Component.getInitialProps(ctx)
          : {};
      const tokenAuth = await Auth.loggedIn(ctx.req);
      const path = ctx.pathname || Router.pathname;
      const checkUrl = openUrl.some(
        item => item.link === path,
      );
      if (!tokenAuth && !checkUrl) {
        if (ctx.res) {
          ctx.res.writeHead(302, {
            Location: URL.LOGIN.link
          });
          ctx.res.end();
        } else {
          Router.push(URL.LOGIN.link);
        }
      }
      return { ...pageProps, tokenAuth };
    }

    // componentDidMount() {
    //   const { tokenAuth } = this.props;
    //   const checkUrl = openUrl.some(
    //     item => item.link === Router.pathname,
    //   );
    //   if (!tokenAuth && !checkUrl) {
    //     Router.replace(URL.LOGIN.link);
    //   }
    // }

    render() {
      return <Component {...this.props} />;
    }
  };
}
