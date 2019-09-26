import React, { Component } from 'react';
import { Layout } from 'antd';
import ShHeader from './Header';
import ShSider from './Sider';
import ShSection from './Section';

class Frame extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { children, list } = this.props;
    return (
      <Layout>
        <ShHeader list={list} />
        {/* <ShSider /> */}
        <ShSection>{children}</ShSection>
      </Layout>
    );
  }
}

export default Frame;
