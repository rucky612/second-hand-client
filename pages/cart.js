import React, { Component } from "react";
import Router from "next/router";
import { Button, Table, Modal, message } from "antd";
import AuthService from "../utils/AuthService";
import CartService from "../utils/CartService";
import URL from "../constants/route-url";

const { confirm } = Modal;

const CartSer = new CartService();
const Auth = new AuthService();

export class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      columns: [
        {
          title: "번호",
          dataIndex: "c_index",
          key: "c_index",
          width: 80
        },
        {
          title: "상품명",
          dataIndex: "p_name",
          key: "p_name",
          width: 180
        },
        {
          title: "이미지",
          dataIndex: "p_image",
          key: "p_image",
          render: (text, record) =>
            record.p_image ? (
              <div>
                <img
                  style={{ width: "50px" }}
                  src={record.p_image.src}
                  alt={record.p_image.alt}
                />
              </div>
            ) : (
              <div>이미지 준비중...</div>
            )
        },
        {
          title: "판매가",
          dataIndex: "p_price",
          key: "p_price"
        },
        {
          title: "수량",
          dataIndex: "c_amount",
          key: "c_amount"
        },
        {
          title: "주문관리",
          dataIndex: "action",
          key: "action",
          width: 130,
          render: (_, record) => (
            <Button onClick={() => this.deleteCart(record.c_id)}>
              삭제하기
            </Button>
          )
        }
      ]
    };
  }

  static async getInitialProps(ctx) {
    const token = Auth.getToken(ctx.req);
    const cart = await CartSer.getCarts(token);
    return { cart };
  }

  onCheckboxChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selected: selectedRows
    });
  };

  addIndexRows = rows =>
    rows.map((row, index) => ({
      ...row,
      key: index + 1,
      c_index: index + 1
    }));

  deleteCart = id => {
    confirm({
      title: "상품을 장바구니에서 삭제하시겠습니까?",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      async onOk() {
        const res = await CartSer.deleteCart(id);
        if (res.success) {
          Router.replace(Router.pathname);
        } else {
          message.error(res.msg);
        }
      }
    });
  };

  postOrders = () => {
    const { selected } = this.state;
    const queryStr = JSON.stringify(selected);
    Router.push({ pathname: URL.ORDER.link, query: { selected: queryStr } });
  };

  render() {
    const { columns, selected } = this.state;
    const { cart } = this.props;
    const { rows } = cart;
    const disabled = selected.length === 0;
    return (
      <div>
        <Table
          dataSource={this.addIndexRows(rows)}
          columns={columns}
          pagination={false}
          rowSelection={{
            onChange: this.onCheckboxChange
          }}
        />
        <div style={{ width: "40%", margin: "48px auto" }}>
          <Button
            onClick={this.postOrders}
            disabled={disabled}
            block
            size="large"
          >
            주문하기
          </Button>
        </div>
      </div>
    );
  }
}

export default Cart;
