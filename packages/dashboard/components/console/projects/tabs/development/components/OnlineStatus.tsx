import classNames from 'classnames';
import React from 'react';
import styles from './onlinestatus.module.scss';

interface OnlineStatusProps {
  active: boolean;
}

function OnlineStatus({ active }: OnlineStatusProps) {
  return (
    <div className={classNames(styles['online-status'], active && styles['active'])}>
      <span className={styles['circle']} />
      {active ? 'active' : 'offline'}
    </div>
  );
}

export default OnlineStatus;
