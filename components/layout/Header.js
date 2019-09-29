import Link from 'next/link';
import { withRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import URL from '../../constants/route-url';

const { Item } = Menu;
const { Header } = Layout;

function activeItem(path, link) {
  return path === link && path !== URL.HOME.link;
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
        onSelect={item => activeItem(router.asPath, item.key)}
        style={{
          lineHeight: '64px',
          borderBottom: 'inherit',
          height: '64px',
          float: 'right',
        }}
      >
        {list.map(
          item =>
            item.text && (
              <Item
                key={item.link}
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
