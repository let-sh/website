import * as React from 'react';
import styles from './footerNav.module.scss';

interface FooterNavProps {
  title: string;
  links: { url: string; name: string; blank?: boolean }[];
}

function FooterNav({ title, links }: FooterNavProps) {
  let id = 1;

  return (
    <div className={styles['footernav-container']}>
      <div className={styles['footernav-title']}>{title}</div>
      <div className={styles['footernav-items']}>
        {links.map(({ name, url, blank = true }) => (
          <div key={id++}>
            <i></i>
            <a href={url} target={blank ? '_blank' : undefined}>
              {name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FooterNav;
