import * as React from 'react';
import Logo from '../../common/logo/logo';
import Nav from './Nav';
import styles from './index.module.scss';

function Header() {
  return (
    // <div className={styles.header}>
    <div className={styles.header + ' container mx-auto px-5 py-2'}>
      <Logo />
      <Nav />
    </div>
  );
}

export default Header;
