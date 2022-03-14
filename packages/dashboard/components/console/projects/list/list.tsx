import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import dayjs from 'dayjs';
import { useProjectsService, ProjectsNode } from 'service/useProjectsService';
import { useSelector } from 'react-redux';
import { RootState } from 'components/console/store';
import styles from '../project.module.scss';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [list, setList] = useState<ProjectsNode[]>([]);
  const [afterCursor, setAfterCursor] = useState<number>();
  const firstFetchRef = useRef(true);
  const listContainer = document.getElementById('project-wrapper');
  const { loading, data, pageInfo, totalCount, getProjects } = useProjectsService({
    first: Math.floor(Number(listContainer?.clientHeight) / 100 + 1),
  });

  useEffect(() => {
    if (data.length > 0) {
      setList([...list, ...data]);
      firstFetchRef.current = false;
    }
  }, [data]);

  useEffect(() => {
    if (getProjects) {
      getProjects({
        variables: {
          after: afterCursor,
        },
      });
    }
  }, [afterCursor]);

  const handleInfiniteOnLoad = useCallback(() => {
    if (list.length > totalCount) {
      return;
    }
    setAfterCursor(pageInfo.endCursor);
  }, [pageInfo.endCursor, totalCount]);

  return (
    <div className={styles['project-list']}>

      {firstFetchRef.current && list.length === 0 && !loading ? (
        <div
          className="flex items-center justify-center w-full h-full bg-white rounded-2xl"
          style={{
            minHeight: '80vh',
            boxShadow: '0 3px 10px 0 rgb(10 97 179 / 10%)',
          }}
        >
          <div className="align-middle">
            <h1 className="text-3xl font-bold">Empty project list, ready to create one?</h1>
            <p className="mt-4 text-xl text-gray-400">
              {' '}
              You could follow this{' '}
              <a className="text-blue-500 underline" href="https://docs.let.sh/" target="_blank">
                quick start guide
              </a>{' '}
              to create your first project.
            </p>
          </div>
        </div>
      ) : (
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!loading && pageInfo.hasNextPage}
          useWindow={false}
          getScrollParent={() => listContainer}
        >
          {list.map(({ node: item }) => {
            return (
              <div
                className={styles['project-item']}
                key={item.id}
                onClick={() => {
                  navigate(`${location.pathname}/${item.name}`);
                }}
              >
                <div className={styles['project-item-top']}>
                  <div className={styles['project-item-name']}>{item.name}</div>
                </div>
                <div className={styles['project-item-bottom']}>
                  <div className={styles['project-item-id']}>{item.id}</div>
                  <div className={styles['project-item-date']}>
                    {/* {dayjs(item.createdAt).tz(timezone).format('YYYY-MM-DD HH:mm:ss')} */}
                    {dayjs(item.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            );
          })}
          {loading && pageInfo.hasNextPage && (
            <div className={styles['list-loading-container']}>
              <Spin />
            </div>
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ProjectList;
