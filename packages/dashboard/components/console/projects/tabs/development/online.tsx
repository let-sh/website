import { LinkOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useReducer, useState } from 'react';
import { Button } from './components/button';
import OnlineStatus from './components/OnlineStatus';
import styles from './online.module.scss';
import { OnlineRequestDetail, OnlineRequstOverview } from './components/onlineListItem';
import { onlineRequestReducer, ACTION } from './reducer/onlineRequest';
import { useDevelopmentSubscribe } from 'service/useDevelopmentSubscribe';
import { DevelopmentInfo } from 'service/useDevelopments';

function Online({
  projectID,
  developmentInfo,
}: {
  projectID: string;
  developmentInfo: DevelopmentInfo;
}) {
  const [startTime, setStartTime] = useState(dayjs(0).format('YYYY-MM-DDTHH:mm:ssZ'));
  const [endTime, setEndTime] = useState(dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'));
  const [selected, setSelected] = useState(0);
  const [requests, setRequests] = useReducer(onlineRequestReducer, []);

  const { data, error } = useDevelopmentSubscribe(projectID, (data) => {
    console.log(data);
    setRequests({
      type: ACTION.Add,
      payload: {
        ...data,
        requestUrl: data.requestUrl.replace(/.*?\//, '/'),
      },
    });
  });

  return (
    <div>
      <div className={styles['header']}>
        <OnlineStatus active={true} />
        <span className={styles['link']}>
          <LinkOutlined />
          <a href={'https://' + developmentInfo.fqdn} target="_blank">
            {developmentInfo.fqdn}
          </a>
        </span>
        <Button
          className={styles['clear']}
          onClick={() => {
            setRequests({ type: ACTION.Reset });
          }}
        >
          Clear Requests
        </Button>
      </div>
      <div className={styles['updated']}>
        latest updated at: {dayjs(developmentInfo.updatedAt).fromNow()}
      </div>
      <div className={styles['online-container']}>
        <div className="flex flex-col h-full">
          <div className={styles['search-container']}>
            <SearchOutlined
              style={{
                color: 'rgba(7, 134, 255, 0.2)',
                marginRight: '8px',
              }}
            />
            <input placeholder="search url path" />
          </div>
          <div className={styles['request-list-container']}>
            {requests.map((data, index) => (
              <OnlineRequstOverview
                key={index}
                {...data}
                active={selected === index}
                onClick={() => setSelected(index)}
              />
            ))}
          </div>
        </div>
        {requests.length > 0 && <OnlineRequestDetail {...requests[selected]} />}
      </div>
    </div>
  );
}

export default Online;
