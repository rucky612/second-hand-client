import React from 'react';
import { Layout, Breadcrumb } from 'antd';

const { Content } = Layout;

function Section(props) {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  return (
    <Layout
      style={{
        padding: '0 24px 24px',
        marginTop: '64px' /* marginLeft: '200px' */,
        background: 'white',
      }}
    >
      {/* <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}

export default Section;
