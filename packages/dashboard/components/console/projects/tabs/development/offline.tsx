import { CopyOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import OnlineStatus from './components/OnlineStatus';
import styles from './offline.module.scss';
import Clipboard from 'clipboard';
import { message } from 'antd';
function Offline() {
  useEffect(() => {
    const cbd = new Clipboard('#dev');
  }, []);
  return (
    <div>
      <OnlineStatus active={false} />
      <div className={styles['offline-container']}>
        <div className={styles['title']}>No active development connection</div>
        <div className={styles['description']}>
          You could start development tunnel via the
          <br /> command below, or visit <a className='underline text-blue-500' target='_blank' href='https://docs.let.sh/quickstart/development'> this quick start guide</a>.
        </div>
        <div className={styles['dev']} id="dev" data-clipboard-text="lets dev">
          lets dev
          <CopyOutlined
            onClick={() => { 
              message.success('copied success');
            }}
            style={{
              fontSize: '16px',
              marginLeft: '20px',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Offline;
