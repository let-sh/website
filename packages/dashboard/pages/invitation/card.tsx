import React from 'react';
import styles from './card.module.scss';
import Link from 'next/link';
import { IS_X5TBS } from '../../utils/utils';

function Card({
  title,
  text,
  videoUrl,
  clickUrl,
}: {
  title: string;
  text: string;
  videoUrl: string;
  clickUrl: string;
}) {
  return (
    <div className={styles['container']}>
      <a href={clickUrl} target="_blank">
        <div className={styles['external-link']}>
          <img className={styles['external-link-icon']} src={require('assets/img/external.svg')} />
        </div>
        <div className={styles['video-wrapper']}>
          <video
            className={styles['bg']}
            loop={true}
            autoPlay={true}
            muted={true}
            preload="metadata"
            playsInline={true}
            webkit-playsinline="true"
            poster={videoUrl + '?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast'}
            x5-video-player-type={IS_X5TBS ? 'h5-page' : null}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className={styles['text-container']}>
          <p className={styles['title']}>{title}</p>
          <p className={styles['text']}>{text}</p>
        </div>
      </a>
    </div>
  );
}

export default Card;
