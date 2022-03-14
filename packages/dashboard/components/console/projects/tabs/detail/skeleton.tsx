import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './detail.module.scss';

function Skeleton() {
  return (
    <>
      <div className={styles['detail-item-container']}>
        <div className={styles['detail-item-col']}>
          <ContentLoader viewBox="0 0 400 84" width="100%" preserveAspectRatio="none" height="84">
            <rect x="0" y="0" rx="4" ry="4" width="400" height="22" />
            <rect x="0" y="28" rx="4" ry="4" width="400" height="22" />
            <rect x="0" y="56" rx="4" ry="4" width="400" height="22" />
          </ContentLoader>
        </div>
        <div className={styles['vertical-line']} />
        <div className={styles['detail-item-col']}>
          <ContentLoader viewBox="0 0 400 84" width="100%" preserveAspectRatio="none" height="84">
            <rect x="0" y="0" rx="4" ry="4" width="400" height="22" />
            <rect x="0" y="28" rx="4" ry="4" width="400" height="22" />
            <rect x="0" y="56" rx="4" ry="4" width="400" height="22" />
          </ContentLoader>
        </div>
      </div>
      <div className={styles['detail-lighthouse-url']}>
        <ContentLoader height="16">
          <rect x="0" y="0" rx="4" ry="4" width="300" height="16" />
        </ContentLoader>
      </div>
    </>
  );
}

export default Skeleton;
