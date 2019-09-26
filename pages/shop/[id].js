import React, { Component } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { Carousel, Descriptions, Form, Button, Row, Col, Modal, message } from 'antd';
import NumberInput from '../../components/NumberInput';
import ProductService from '../../utils/ProductService';
import CartService from '../../utils/CartService';
import AuthService from '../../utils/AuthService';
import withAuth from '../../utils/withAuth';
import URL from '../../constants/route-url';

const { confirm } = Modal;

const Img = styled.img`
  width: 450px;
  margin: auto;
`;

const CustomCarousel = styled(Carousel)`
  && {
    height: 600px;
    .slick-dots li button {
      width: 24px;
      height: 4px;
      background: black;
    }
    .slick-dots li.slick-active button {
      width: 32px;
      height: 4px;
    }
  }
`;

const Product = new ProductService();
const Cart = new CartService();
const Auth = new AuthService();

class ShopDetail extends Component {
  static async getInitialProps(ctx) {
    const product = await Product.getProductOne(ctx.query.id);
    return { product: product[0] };
  }

  handleSubmit = e => {
    const { tokenAuth, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received errors of form: ', values);
      } else {
        if (!tokenAuth) {
          confirm({
            title: '로그인이 필요한 작업입니다. 로그인 하러 가시겠습니까?',
            okText: '로그인',
            cancelText: '취소',
            onOk() {
              Router.push(URL.LOGIN.link);
            },
          });
        } else {
          this.postCart(values)
        }
      }
    });
  };

  postCart = async ({ amount }) => {
    const { product } = this.props;
    const token = Auth.getToken();
    const res = await Cart.postCart(product.p_id, token, amount)
    if(res.success) {
      Router.push(URL.CART.link);
    } else {
      message.error(res.msg)
    }
  }

  checkIntNumber = (rule, value, cb) => {
    const { product } = this.props;
    const checkNum = /^[0-9]+$/.test(value);
    if (!value) {
      cb('');
    }
    if (value && !checkNum) {
      cb('양의 숫자만 입력해주세요.');
    }
    if (Number(value) >= Number(product.p_amount)) {
      cb('상품수량을 초과할 수 없습니다. 주문량을 줄여주세요.');
    }
    cb();
  };

  render() {
    const { product, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <CustomCarousel>
              {product.p_image.map(img => (
                <div key={img.src}>
                  <Img alt={img.alt} src={img.src} />
                </div>
              ))}
            </CustomCarousel>
          </Col>
          <Col span={12}>
            <Descriptions
              style={{ marginBottom: '30px' }}
              title="상품 정보"
              bordered
            >
              <Descriptions.Item label="카테고리" span={3}>
                {product.p_category.label}
              </Descriptions.Item>
              <Descriptions.Item label="상품명" span={3}>
                {product.p_name}
              </Descriptions.Item>
              <Descriptions.Item label="상품 설명" span={3}>
                {product.p_description}
              </Descriptions.Item>
              <Descriptions.Item label="상품 가격">
                {product.p_price}원
              </Descriptions.Item>
              <Descriptions.Item label="상품 수량">
                {product.p_amount}
              </Descriptions.Item>
            </Descriptions>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator('amount', {
                  rules: [
                    { required: true, message: '수량을 입력해주세요' },
                    {
                      validator: this.checkIntNumber,
                    },
                  ],
                })(
                  <NumberInput style={{ width: '130px' }} placeholder="수량" />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  장바구니 담기
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const ShopForm = Form.create()(ShopDetail);

export default withAuth(ShopForm);
