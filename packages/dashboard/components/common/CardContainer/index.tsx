import React from 'react';
import styles from './index.module.scss';

function CardContainer({ children, style }: any) {
  return (
    <div style={style} className={styles['container']}>
      {children}
    </div>
  );
}

export default CardContainer;
