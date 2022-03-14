import { useQuery } from '@apollo/client';
import classNames from 'classnames';
import { gql } from '@apollo/client';
import React from 'react';
import style from './tabs.module.scss';

interface Dns {
  cn: boolean;
  hostname: string;
}

export function DnsTab({ cn, hostname }: Dns) {
  const { data } = useQuery<{
    verifyDNSRecord: {
      records: {
        type: string;
        name: string;
        tldPlusOne: string;
        value: string;
      }[];
    };
  }>(
    gql`
      query {
        verifyDNSRecord(hostname: "${hostname}", cn: ${cn}) {
          records {
            type
            name
            tldPlusOne
            value
          }
        }
      }
    `
  );

  const records = data?.verifyDNSRecord.records || [];

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <div className={style['t1-text']}>
          <div className={style['t1-text-title']}>Current Detected DNS Results:</div>
          <div className={classNames('flex', style['t1-text-list'])}>
            {records.map((record) => (
              <React.Fragment key={record.value}>
                <div className="flex flex-col">
                  <span>Type</span>
                  <span>{record.type}</span>
                </div>
                <div className="flex flex-col">
                  <span>Name</span>
                  <span>{record.name}</span>
                </div>
                <div className="flex flex-col">
                  <span>Domain</span>
                  <span>{record.tldPlusOne}</span>
                </div>
                <div className="flex flex-col">
                  <span>Value</span>
                  <span>{record.value}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className={style['t1-text']}>
          <div className={style['t1-text-title']}>Expected DNS Configs:</div>
          <div className={classNames('flex', style['t1-text-list'])}>
            <div className="flex flex-col">
              <span>Type</span>
              <span>CNAME</span>
            </div>
            <div className="flex flex-col">
              <span>Name</span>
              <span>@</span>
            </div>
            <div className="flex flex-col">
              <span>Domain</span>
              <span>let.sh</span>
            </div>
            <div className="flex flex-col">
              <span>Value</span>
              <span>global.oasis.name</span>
            </div>
          </div>
        </div>
      </div>
      <div className={style['t1-notice']}>
        DNS hanges may takes hours to take effect. Learn More
      </div>
    </div>
  );
}
