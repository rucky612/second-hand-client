import React, { Component } from 'react';
import Router from 'next/router';
import _ from 'lodash';
import { Button, Table, Descriptions } from 'antd';
import AuthService from '../../utils/AuthService';
import UserService from '../../utils/UserService';
import OrderService from '../../utils/OrderService';
import withAuth from '../../utils/withAuth';
import URL from '../../constants/route-url';

const Auth = new AuthService();
const User = new UserService();
const Order = new OrderService();

class Mypage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          title: '번호',
          dataIndex: 'o_index',
          key: 'o_index',
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
          dataIndex: 'o_amount',
          key: 'o_amount',
        },
        {
          title: '주문상태',
          dataIndex: 'o_status',
          key: 'o_status',
          render: text => this.renderStatus(text),
        },
      ],
    };
  }

  static async getInitialProps(ctx) {
    const token = Auth.getToken(ctx.req);
    const userData = token ? await User.getUser(token) : null;
    const orders = await Order.getOrders(token);
    return { user: userData ? userData.user : null, orders };
  }

  addIndexRows = rows =>
    rows.map((row, index) => ({
      ...row,
      key: index + 1,
      o_index: index + 1,
    }));

  renderStatus = num => {
    if (num === 1) {
      return '입고';
    }
    if (num === 2) {
      return '배송중';
    }
    if (num === 3) {
      return '배송완료';
    }
    if (num === 4) {
      return '반품중';
    }
    return 'X';
  };

  pushModify = () => {
    Router.push(URL.MYPAGE.MODIFY.link);
  };

  render() {
    const { columns } = this.state;
    const { user, orders } = this.props;
    const { rows } = orders;
    return (
      <div>
        {user && !_.isEmpty(user) && (
          <Descriptions
            title={
              <div>
                개인정보
                <Button
                  onClick={this.pushModify}
                  style={{ float: 'right', height: '24px' }}
                >
                  수정
                </Button>
              </div>
            }
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            style={{ marginBottom: '24px' }}
          >
            <Descriptions.Item label="이름" span={1}>
              {user.u_name}
            </Descriptions.Item>
            <Descriptions.Item label="전화번호" span={1}>
              {user.u_phone}
            </Descriptions.Item>
            <Descriptions.Item label="이메일" span={1}>
              {user.u_email}
            </Descriptions.Item>
            <Descriptions.Item label="주소">{user.u_address}</Descriptions.Item>
          </Descriptions>
        )}
        <h3 style={{ marginBottom: '24px', fontWeight: 'bold' }}>주문 현황</h3>
        <Table
          dataSource={this.addIndexRows(rows)}
          columns={columns}
          pagination={false}
          scroll={{ x: 686 }}
        />
      </div>
    );
  }
}

export default withAuth(Mypage);
