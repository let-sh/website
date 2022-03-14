import React from 'react';
import DomainListItem from './listItem';
import styles from './index.module.scss';
import { CertificatStatus } from './utils';

interface Domain {
  domain: string;
  id: string;
  cn: boolean;
  certificateStatus: CertificatStatus;
  channel: string;
}

function domainFilter(domains: Domain[]) {
  let gl: Domain[] = [];
  let cn: Domain[] = [];

  const newDomains = domains.slice();

  // sort by channel
  newDomains.sort((a, b) => b.channel.localeCompare(a.channel));
  newDomains.forEach((domain) => {
    if (domain.cn) {
      cn.push(domain);
    } else {
      gl.push(domain);
    }
  });

  return { gl, cn };
}

function Domains({ domains }: { domains: Domain[] }) {
  const domainList = domainFilter(domains);

  return (
    <>
      {domainList.gl.length > 0 && (
        <div>
          <p className={styles['title']}>Global</p>
          {domainList.gl.map(({ domain, id, certificateStatus, channel }) => (
            <DomainListItem
              domain={domain}
              key={id}
              prod={channel === 'prod'}
              certificateStatus={certificateStatus}
              cn={false}
            />
          ))}
        </div>
      )}
      {domainList.cn.length > 0 && (
        <div>
          <p className={styles['title']}>China</p>
          {domainList.cn.map(({ domain, id, certificateStatus, channel }) => (
            <DomainListItem
              domain={domain}
              key={id}
              prod={channel === 'prod'}
              certificateStatus={certificateStatus}
              cn={true}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Domains;
