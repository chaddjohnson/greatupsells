import App from 'next/app';
import { Container } from 'semantic-ui-react';
import { Menu } from '../components';
import 'semantic-ui-css/semantic.css';

export default class extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Menu />
        <Container>
          <Component {...pageProps} />
        </Container>
      </>
    );
  }
}
