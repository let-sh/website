import * as React from 'react';
import styles from './logo.module.scss';
import Link from 'next/link';

function Logo({ className, reverse }: any) {
  return (
    <Link href="/">
      <div className={`${styles['logo-container']} ${className}`}>
        <div
          className={styles['logo-title']}
          style={{
            color: reverse ? '#fff' : '#000',
          }}
        >
          let.sh
        </div>
        <div
          className={styles['logo-alpha']}
          style={{
            color: reverse ? '#0786FF' : '#fff',
            backgroundColor: reverse ? '#fff' : '#0786FF',
          }}
        >
          alpha
        </div>
      </div>
    </Link>
  );
}

export default Logo;
