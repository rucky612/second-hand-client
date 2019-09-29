import React, { Component } from 'react';
import { Button, Descriptions, Table } from 'antd';
import _ from 'lodash';
import Router from 'next/router';
import AuthService from '../utils/AuthService';
import OrderService from '../utils/OrderService';
import UserService from '../utils/UserService';
import withAuth from '../utils/withAuth';
import URL from '../constants/route-url';

function jsonValidation(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

const Auth = new AuthService();
const OrderSer = new OrderService();
const UserSer = new UserService();

class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          title: '번호',
          dataIndex: 'c_index',
          key: 'c_index',
          width: 80,
        },
        {
          title: '상품명',
          dataIndex: 'p_name',
          key: 'p_name',
          width: 180,
        },
        {
          title: '상품설명',
          dataIndex: 'p_description',
          key: 'p_description',
        },
        {
          title: '이미지',
          dataIndex: 'p_image',
          key: 'p_image',
          render: (text, record) =>
            record.p_image ? (
              <div>
                <img
                  style={{ width: '50px' }}
                  src={record.p_image.src}
                  alt={record.p_image.alt}
                />
              </div>
            ) : (
              <div>이미지 준비중...</div>
            ),
        },
        {
          title: '판매가',
          dataIndex: 'p_price',
          key: 'p_price',
        },
        {
          title: '수량',
          dataIndex: 'c_amount',
          key: 'c_amount',
        },
      ],
    };
  }

  static async getInitialProps({ query, req, res }) {
    if (!query.selected) {
      if (res) {
        res.writeHead(302, {
          Location: URL.CART.link,
        });
        res.end();
      } else {
        Router.push(URL.CART.link);
      }
    }
    const orders = jsonValidation(query.selected)
      ? JSON.parse(query.selected)
      : [];
    const token = Auth.getToken(req);
    const userData = token ? await UserSer.getUser(token) : null;
    return { orders, user: userData ? userData.user : null };
  }

  getTotalPrice = () => {
    const { orders } = this.props;
    return orders.reduce(
      (price, order) => price + order.p_price * order.c_amount,
      0,
    );
  };

  postOrders = async () => {
    const { orders } = this.props;
    const token = Auth.getToken();
    const postObjs = orders.map(order => ({
      o_p_id: order.p_id,
      o_amount: order.c_amount,
      c_id: order.c_id,
    }));
    const res = await OrderSer.postOrders(token, postObjs);
    if (res.success) {
      Router.push(URL.MYPAGE.link);
    } else {
      Router.push(URL.CART.link);
    }
  };

  render() {
    const { columns } = this.state;
    const { orders, user } = this.props;
    const total = this.getTotalPrice();
    return (
      <div>
        <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>상품 정보</h3>
        <Table dataSource={orders} columns={columns} pagination={false} />
        {user && !_.isEmpty(user) && (
          <Descriptions
            title="주문 정보"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            style={{ marginTop: '48px' }}
          >
            <Descriptions.Item label="총금액" span={1}>
              {total}
            </Descriptions.Item>
            <Descriptions.Item label="이름" span={1}>
              {user.u_name}
            </Descriptions.Item>
            <Descriptions.Item label="전화번호" span={1}>
              {user.u_phone}
            </Descriptions.Item>
            <Descriptions.Item label="이메일" span={3}>
              {user.u_email}
            </Descriptions.Item>
            <Descriptions.Item label="주소" span={3}>
              {user.u_address}
            </Descriptions.Item>
          </Descriptions>
        )}
        <div style={{ width: '40%', margin: '48px auto' }}>
          <Button onClick={this.postOrders} block size="large">
            결제하기
          </Button>
        </div>
      </div>
    );
  }
}

export default withAuth(Order);
