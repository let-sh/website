import React from 'react';
import ContentLoader from 'react-content-loader';
import { List, Pagination, Spin } from 'antd';
import styles from './index.module.scss';

function Skeleton() {
  const list = Array(20).fill(1);
  let id = 0;
  return (
    <>
      <List
        dataSource={list}
        className={styles['list-container']}
        renderItem={() => (
          <List.Item key={id++}>
            <ContentLoader viewBox="0 0 400 61" width="100%" preserveAspectRatio="none" height="61">
              <rect x="0" y="0" rx="4" ry="4" width="400" height="61" />
            </ContentLoader>
          </List.Item>
        )}
      ></List>
    </>
  );
}

export default Skeleton;
