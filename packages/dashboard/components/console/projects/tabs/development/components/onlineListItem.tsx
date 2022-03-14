import { Tabs } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import msToTime from 'lib/msToTime';
import React from 'react';
import { Button } from './button';
import styles from './onlineListItem.module.scss';

interface OnlineRequstOverviewProps {
  requestMethod: string;
  requestUrl: string;
  statusCode: number;
  duration: number;
  ts: string;
  active?: boolean;
  onClick?: () => void;
}

interface OnlineRequestDetailProps {
  requestBody: string;
  requestHeader: string;
  responseBody: string;
  responseHeader: string;
  requestMethod: string;
  requestUrl: string;
  statusCode: number;
  ts: string;
  duration: number;
}

export function OnlineRequstOverview({
  requestMethod,
  requestUrl,
  statusCode,
  duration,
  ts,
  active = false,
  onClick = () => {},
}: OnlineRequstOverviewProps) {
  return (
    <div
      className={classNames(styles['overview-container'], 'flex justify-between', {
        [styles['active']]: active,
      })}
      onClick={onClick}
    >
      <div>
        <div className={classNames(styles['overview-method'], 'flex', 'items-center')}>
          <span>{requestMethod}</span> <span className={styles['overview-url']}>{requestUrl}</span>
        </div>
        <div className={styles['overview-time']}>{msToTime(duration*1000)}</div>
      </div>
      <div className="flex flex-col items-center">
        <span
          className={classNames(
            styles['status'],
            {
              [styles['redirect']]: statusCode >= 300 && statusCode < 400,
              [styles['error']]: statusCode >= 400,
            },
            'inline-block'
          )}
        >
          {statusCode}
        </span>
        <span className={styles['overview-time']}>{dayjs(ts).format('HH:mm:ss')}</span>
      </div>
    </div>
  );
}

export function OnlineRequestDetail({
  requestMethod,
  requestUrl,
  duration,
  ts,
  statusCode,
  requestBody,
  requestHeader,
  responseBody,
  responseHeader,
}: OnlineRequestDetailProps) {
  const reqHeader = JSON.parse(requestHeader);
  const resHeader = JSON.parse(responseHeader);

  return (
    <div className={styles['detail-container']}>
      <div>
        <span className={styles['detail-method']}>{requestMethod}</span>
        <span className={styles['detail-url']}>{requestUrl}</span>
        <span
          className={classNames(styles['status'], {
            [styles['redirect']]: statusCode >= 300 && statusCode < 400,
            [styles['error']]: statusCode >= 400,
          })}
          style={{
            marginLeft: 30,
          }}
        >
          {statusCode}
        </span>
        <div className={classNames('flex', styles['other-btns'])}>
          <Button onClick={() => {}}>Replay</Button>
          <Button className={styles['btn-copy']} onClick={() => {}}>
            Copy As
          </Button>
        </div>
      </div>
      <div className={classNames(styles['detail-basic-info'], 'flex')}>
        <div className="flex flex-col">
          <span>Duration: {msToTime(duration*1000)}</span>
          <span
            style={{
              marginTop: '6px',
            }}
          >
            ClientIP: {reqHeader['X-Forwarded-For']}
          </span>
        </div>
        <div
          className="flex flex-col"
          style={{
            marginLeft: '70px',
          }}
        >
          <span>Time: {dayjs(ts).format('YYYY-MM-DD HH:mm:ss')}</span>
          <span
            style={{
              marginTop: '6px',
            }}
          >
            Protocol: HTTP/1.1
          </span>
        </div>
      </div>
      <Tabs
        onChange={(ak) => {}}
        size={'large'}
        tabBarStyle={{
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '19px',
          letterSpacing: '0.3px',
        }}
      >
        <Tabs.TabPane tab="Request" key="request">
          <HeaderBody headers={reqHeader} body={requestBody} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Response" key="response">
          <HeaderBody headers={resHeader} body={responseBody} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

function HeaderBody({ headers, body }: { headers: any; body: string }) {
  return (
    <div>
      <div className={styles['headers-body']}>Headers</div>
      {headers ? (
        <div className={styles['headers-body-main']}>
          {Object.keys(headers).map((header) => {
            const valList = headers[header];
            return (
              <React.Fragment key={header}>
                {valList.map((val: string) => {
                  return (
                    <div className={styles['headers-body-header-item']} key={val}>
                      <span className={styles['list-h']}>{header}</span>
                      <span className={styles['list-v']}>{val}</span>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div
          className={classNames(styles['headers-body-empty'], 'flex items-center justify-center')}
        >
          Empty Headers
        </div>
      )}
      <div
        style={{
          marginTop: '20px',
        }}
        className={styles['headers-body']}
      >
        Payload
      </div>
      {body ? (
        <div className={styles['headers-body-body-item']}>{atob(body)}</div>
      ) : (
        <div
          className={classNames(styles['headers-body-empty'], 'flex items-center justify-center')}
        >
          Empty Payload
        </div>
      )}
    </div>
  );
}
