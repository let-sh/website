import React, { useCallback, useEffect, useState } from 'react';
import { List, Pagination, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate, Route } from 'react-router';
import { useDeploymentsService, DeploymentsNode } from 'service/useDeploymentsService';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'components/console/store';
import Skeleton from './skeleton';

dayjs.extend(relativeTime);

function Deployments({ projectName }: { projectName: string }) {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const [list, setList] = useState<DeploymentsNode[]>([]);
  const { loading, data, pageInfo, totalCount, fetchMore } = useDeploymentsService({
    projectName,
    first: Math.floor(window.innerHeight / 80),
  });

  useEffect(() => {
    console.log(data);
    if (data.length > 0) {
      setList([...list, ...data]);
    }
  }, [data]);

  return (
    <div className={styles['deployments-container']}>
      {loading && list.length === 0 ? (
        <Skeleton />
      ) : (
        <InfiniteScroll
          next={() => {
            fetchMore({
              variables: {
                after: pageInfo.endCursor,
              },
            });
          }}
          hasMore={!loading && pageInfo.hasNextPage}
          dataLength={list.length}
          loader={null}
          scrollableTarget="project-wrapper"
        >
          {list.map(({ node: item }) => {
            return (
              <div
                key={item.id}
                className={styles['item-container'] + ' cursor-pointer'}
                onClick={() => {
                  dispatch.project.setversion(item.version);
                  navigate(`logs/${item.id}`);
                }}
              >
                <div className={styles['item-channel-container']}>
                  <span className="font-bold">
                    {item.channel === 'dev' ? 'Development' : 'Production'}
                    {': '}
                  </span>
                  <span>v{item.version}</span>
                </div>
                <div className={`${styles['item-status']} ${styles[item.status.toLowerCase()]}`}>
                  {item.status.toLowerCase()}
                </div>
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={`https://${item.targetFQDN}`}
                  target="_blank"
                >{`https://${item.targetFQDN}`}</a>
                <div
                  style={{ right: 11, color: 'rgba(0, 0, 0, 0.34)' }}
                  className={'flex flex-col absolute text-xs  '}
                >
                  <span className={styles['item-time']}>{dayjs(item.createdAt).fromNow()}</span>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
}

export default React.memo(Deployments, (prev, next) => {
  return prev.projectName === next.projectName;
});
