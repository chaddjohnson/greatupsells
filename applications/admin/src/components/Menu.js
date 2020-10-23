import { Container, Image, Menu } from 'semantic-ui-react';
import Link from 'next/link';

export default () => (
  <Menu>
    <Container>
      <Menu.Item as="a" header>
        <Image
          size="small"
          src="http://via.placeholder.com/300x75"
          alt="Mobile Menu"
        />
      </Menu.Item>
      <Menu.Menu position="right">
        <Link href="/login" passHref>
          <Menu.Item as="a">Login</Menu.Item>
        </Link>
      </Menu.Menu>
    </Container>
  </Menu>
);
