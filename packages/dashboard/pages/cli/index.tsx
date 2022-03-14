import React, { useEffect, useState } from 'react';
import { Divider, Tooltip } from 'antd';
import cls from 'classnames';
import styles from './index.module.scss';
import CommonHead from 'components/common/head';
import Header from 'components/dashboard/header';
import { CopyOutlined } from '@ant-design/icons';
import Clipboard from 'clipboard';

export default function CliPage() {
  const [tipVisible, setVisible] = useState(false);
  useEffect(() => {
    const cbd = new Clipboard('#cli-curl');
  }, []);

  return (
    <>
      <CommonHead />
      <Header />
      <div
        className="flex items-start justify-center"
        style={{
          height: 'calc(100vh - 70px)',
        }}
      >
        <div className={cls('flex flex-row', styles['cli-container'])}>
          <div>
            <div className={cls('font-bold', styles['cli-text-install'])}>Installing CLI</div>
            <div className={styles['cli-text-version']}>Latest version: v0.0.1</div>
          </div>
          <Divider type="vertical" style={{ height: '385px', margin: '0 44px 0 31px' }} />
          <div>
            <div className={styles['cli-text-download']}>Installing via curl</div>
            <div className={styles['cli-curl']}>
              curl -o- -sL https://install.let.sh.cn/install.sh | bash
              <Tooltip placement="top" title="copied" visible={tipVisible}>
                <span
                  id="cli-curl"
                  data-clipboard-text="curl -o- -sL https://install.let.sh.cn/install.sh | bash"
                  className={styles['cli-curl-copy']}
                  onClick={() => {
                    setVisible(true);

                    setTimeout(() => {
                      setVisible(false);
                    }, 2000);
                  }}
                >
                  <CopyOutlined />
                </span>
              </Tooltip>
            </div>
            <div className={styles['cli-text-download']}>Installing on windows</div>
            <div className={styles['cli-curl']}>
              iwr https://install.let-sh.com/install.ps1 -useb | iex
              <Tooltip placement="top" title="copied" visible={tipVisible}>
                <span
                  id="cli-curl"
                  data-clipboard-text="iwr https://install.let-sh.com/install.ps1 -useb | iex"
                  className={styles['cli-curl-copy']}
                  onClick={() => {
                    setVisible(true);

                    setTimeout(() => {
                      setVisible(false);
                    }, 2000);
                  }}
                >
                  <CopyOutlined />
                </span>
              </Tooltip>
            </div>
            {/* <div
              style={{
                marginTop: 60,
              }}
              className={styles['cli-text-download']}
            >
              Download Directly
            </div>
            <div className={styles['cli-windows']}>Windows</div> */}
          </div>
        </div>
      </div>
    </>
  );
}
