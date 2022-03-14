import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { List, message, Spin, Radio, Card, Dropdown, Menu } from 'antd';
import { useParams } from 'react-router';
import { SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useEffect } from 'react';
import Convert from './ansi-to-html';
import cls from 'classnames';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Dispatch, RootState } from 'components/console/store';
const convert = new Convert();

interface LogsState {
  data: {
    content: string;
    time: string;
  }[];
  loading: boolean;
  hasMore: boolean;
}

const useFetchData = (deploymentID: string, logType: string) => {
  const [getLogs, { loading, data }] = useLazyQuery<
    {
      content: string;
      time: string;
    }[]
  >(
    gql`
      query ($deploymentID: UUID, $type: String!) {
        logs(deploymentID: $deploymentID, type: $type) {
          logs {
            content
            time
            source
          }
        }
      }
    `,
    {
      variables: {
        type: logType,
        deploymentID,
      },
    }
  );

  return [getLogs, { loading, data }] as any;
};

function Logs() {
  const params = useParams();
  const deploymentID = params.id;
  const [showTime, setShowTime] = useState(false);
  const [logType, setLogType] = useState<string>('buildtime');
  const timezone = useSelector((state: RootState) => state.user.preference.timezone);

  const [getLogs, { loading, data = {} }] = useFetchData(deploymentID, logType);

  const menu = (
    <Menu onClick={(info) => setShowTime(!showTime)}>
      <Menu.Item key="time">{showTime ? 'hide time' : 'show time'}</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (deploymentID) {
      getLogs({
        variables: {
          deploymentID,
        },
      });
    }
  }, [deploymentID]);

  let key = 0;
  let lines = 0;
  let datasource = data?.logs?.logs || [];
  datasource = datasource.filter((item: any) => item.content);
  let newData = [];
  for (let i = 0; i < datasource.length; i++) {
    let strs = datasource[i].content.split('\n');
    newData.push(
      ...strs.map((str: string) => {
        return {
          content: str,
          time: datasource[i].time,
        };
      })
    );
  }

  return (
    <div className={styles['logs-container']}>
      <div className="flex justify-end">
        <Dropdown overlay={menu} trigger={['click']}>
          <a className={styles['logs-settings']}>
            <SettingOutlined style={{ fontSize: 16 }} />
          </a>
        </Dropdown>
        <Radio.Group
          className={styles['log-type-switcher']}
          value={logType}
          style={{ float: 'right' }}
          onChange={(e) => setLogType(e.target.value)}
        >
          <Radio.Button value="buildtime">Build</Radio.Button>
          <Radio.Button value="runtime">Runtime</Radio.Button>
        </Radio.Group>
      </div>
      <div
        style={{
          height: 0,
          display: 'block',
          clear: 'both',
          marginBottom: '10px',
        }}
      ></div>
      <Card>
        <List
          split={false}
          dataSource={loading ? [] : newData || []}
          renderItem={(item: any) => (
            <List.Item className={styles['logs-list-item']} key={key++}>
              <span className={cls(styles['logs-line-num'], 'text-right')}>{lines++}</span>
              {showTime && (
                <span className={cls(styles['logs-line-time'], 'text-right', 'ml-3')}>
                  {dayjs(item.time).tz(timezone).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              )}
              <div
                className={cls(styles['logs-list-item-content'], 'ml-3')}
                dangerouslySetInnerHTML={{
                  __html: convert.toHtml(item.content),
                }}
              />
            </List.Item>
          )}
          style={{ overflow: 'auto' }}
        >
          {loading && (
            <div className={styles['demo-loading-container']}>
              <Spin />
            </div>
          )}
        </List>
      </Card>
    </div>
  );
}

export default Logs;
