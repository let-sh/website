import Header from 'components/dashboard/header';
import React from 'react';
import styles from './index.module.scss';

function LoginSuccess() {
  return (
    <div>
      <Header />
      <div className={styles['container']}>
        <div className={styles['succeed']}>Login Succeed</div>
        <div className={styles['welcome']}>It’s great to see you again, </div>
        <div className={styles['des']}>
          You can close this tab now, or visit <a href="/console">console</a>
        </div>
      </div>
    </div>
  );
}

export default LoginSuccess;
