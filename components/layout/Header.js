import Link from 'next/link';
import { withRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import URL from '../../constants/route-url';

const { Item } = Menu;
const { Header } = Layout;

function activeItem(path, href) {
  return path === href && path !== URL.HOME.link
    ? 'ant-menu-item ant-menu-item-selected'
    : 'ant-menu-item';
}

function ShHeader(props) {
  const { list, router } = props;
  return (
    <Header
      className="header"
      style={{
        position: 'fixed',
        width: '100%',
        paddingLeft: '250px',
        paddingRight: '24px',
        background: 'white',
        zIndex: '100',
        borderBottom: '1px solid #e8e8e8',
      }}
    >
      <Link href="/">
        <a href="">
          <h1 style={{ position: 'fixed', left: '24px', fontSize: '25.44px' }}>
            SECOND HAND
          </h1>
        </a>
      </Link>
      <div className="logo" />
      <Menu
        mode="horizontal"
        style={{
          lineHeight: '64px',
          borderBottom: 'inherit',
          height: '64px',
          float: 'right',
        }}
      >
        {list.map(
          (item, index) =>
            item.text && (
              <Item
                key={6 - index}
                className={activeItem(router.asPath, item.link)}
                style={{ fontWeight: '600' }}
                onClick={item.onClick}
              >
                <Link href={item.link}>
                  <a href="">{item.text}</a>
                </Link>
              </Item>
            ),
        )}
      </Menu>
    </Header>
  );
}

export default withRouter(ShHeader);
