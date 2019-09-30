import Link from "next/link";
import React, { Component } from "react";
import { Card, List, message } from "antd";
import ProductService from "../../utils/ProductService";
import URL from "../../constants/route-url";

const { Meta } = Card;

const Product = new ProductService();

export class Shop extends Component {
  static async getInitialProps(ctx) {
    const products = await Product.getProducts();
    return { products };
  }

  componentDidMount() {
    const { products } = this.props;
    if (!products.success) {
      message.error(products.msg);
    }
  }

  renderDescription = item => (
    <div>
      <div>{item.p_description}</div>
      <div style={{ color: "black" }}>{item.p_price} 원</div>
    </div>
  );

  renderProducts = item => {
    return (
      <List.Item key={item.p_id}>
        <Link href={URL.SHOP.ID.link} as={`${URL.SHOP.link}/${item.p_id}`}>
          <Card
            style={{ width: 210, cursor: "pointer" }}
            cover={
              item.p_image ? (
                <img alt={item.p_image[0].alt} src={item.p_image[0].src} />
              ) : (
                <img alt="이미지 준비중입니다." src="*" />
              )
            }
          >
            <Meta
              title={item.p_name}
              description={this.renderDescription(item)}
            />
          </Card>
        </Link>
      </List.Item>
    );
  };

  getData = () => {
    const { products } = this.props;
    return products.rows.map(item => ({
      ...item,
      title: item.p_name
    }));
  };

  render() {
    return (
      <div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 6,
            xxl: 3
          }}
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={this.renderProducts}
        />
      </div>
    );
  }
}

export default Shop;
