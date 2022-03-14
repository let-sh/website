import * as React from 'react';
import FooterNav from '../footerNav/footerNav';
import styles from './index.module.scss';
import { Tooltip } from 'antd';
const productLinks = [
  {
    name: 'Request Invite',
    url: 'https://let.sh/join',
  },
  {
    name: 'Documention',
    url: 'https://docs.let.sh',
  },
  // {
  //   name: 'Pricing',
  //   url: '/#',
  // },
  {
    name: 'Status',
    url: 'https://status.let.sh',
  },
  {
    name: 'Cli',
    url: 'https://let.sh/cli',
    blank: false,
  },
];

const teamLinks = [
  {
    name: 'Blog',
    url: '/blog',
  },
  {
    name: 'About Us',
    url: '/about',
  },
];

const helpLinks = [
  {
    name: 'Feature Request',
    url: 'https://letapp.kampsite.co/',
  },
  {
    name: 'Team of Service',
    url: '/#',
  },
];

function Footer() {
  return (
    <div className={styles['footer-container']}>
      <div className={styles['footer-inner']}>
        <div className={styles['footer-inner-logo']}>
          <Tooltip placement="top" title={'Oasis Networks, the company who created let.sh'}>
            <div className={styles['footer-inner-logo-background']}>
              <a rel="alternate" target="_blank" href="https://oasis.ac">
                Oasis
              </a>
            </div>
          </Tooltip>
        </div>
        <div className={styles['footer-inner-product']}>
          <FooterNav title="Product" links={productLinks} />
        </div>
        <div className={styles['footer-inner-team']}>
          <FooterNav title="Team" links={teamLinks} />
        </div>
        <div className={styles['footer-inner-help']}>
          <FooterNav title="Help & Service" links={helpLinks} />
        </div>
      </div>
      <div className={styles['footer-bottom']}>
        <div className={styles['footer-bottom-container']}>
          <p>Copyright © Oasis Networks, Inc.</p>
          <iframe
            src="https://let_sh.instatus.com/embed-status/light-sm"
            width="245"
            height="41"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Footer;
