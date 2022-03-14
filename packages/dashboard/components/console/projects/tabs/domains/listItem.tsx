import React, { useState } from 'react';
import {
  LinkOutlined,
  ExclamationCircleFilled,
  SyncOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import styles from './listItem.module.scss';
import classNames from 'classnames';
import { Divider } from 'antd';
import { CertificatStatus } from './utils';
import StepTabs from './stepTabs';
import { DnsTab } from './tabs';

interface Domain {
  domain: string;
  cn: boolean;
  certificateStatus: CertificatStatus;
  prod: boolean;
}

const DomainStatusCompoment = {
  [CertificatStatus.DnsError]: (
    <div className={`${styles['domain-status']} ${styles['dns']}`}>
      <span className={styles['domain-status-text']}>wrong dns config</span>
      <ExclamationCircleFilled className={styles['domain-status-icon']} />
    </div>
  ),
  // cert: (
  //   <div className={`${styles['domain-status']} ${styles['cert']}`}>
  //     <span className={styles['domain-status-text']}>sign cert</span>
  //     <ExclamationCircleFilled className={styles['domain-status-icon']} />
  //   </div>
  // ),
  [CertificatStatus.Signing]: (
    <div className={`${styles['domain-status']} ${styles['signing']}`}>
      <span className={styles['domain-status-text']}>signing</span>
      <SyncOutlined spin className={styles['domain-status-icon']} />
    </div>
  ),
  [CertificatStatus.Signed]: <CheckCircleFilled className={styles['status']} />,
};

function DomainListItem({ domain, prod, certificateStatus, cn }: Domain) {
  const [showDetail, setDetail] = useState(false);

  return (
    <div className={styles['container']} style={{maxHeight:showDetail? "480px" : "80px"}}>
      <div
        className={styles['domain-container']}
        onClick={() => {
          setDetail(!showDetail);
        }}
      >
        <a
          className={styles['domain-name']}
          href={`https://${domain}`}
          target="_blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {domain}
          <LinkOutlined
            style={{
              fontSize: '14px',
              marginLeft: '7px',
              color: '#0786ff',
              fontWeight: 'bold',
            }}
          />
        </a>

        {prod ? (
          <div className={styles['env-tag']}>Production</div>
        ) : (
          <div className={classNames(styles['env-tag'], styles['dev'])}>Development</div>
        )}
        {DomainStatusCompoment[certificateStatus]}
      </div>
      {showDetail && (
        <>
          <Divider
            style={{
              margin: 0,
              marginBottom: 18,
            }}
          />
          <StepTabs certificateStatus={certificateStatus}>
            {[<DnsTab key={1} cn={cn} hostname={domain} />, <div key={2}></div>]}
          </StepTabs>
        </>
      )}
    </div>
  );
}

export default DomainListItem;
