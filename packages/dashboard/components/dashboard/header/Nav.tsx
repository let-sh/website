import * as React from 'react';
import styles from './Nav.module.scss';
import Link from 'next/link';

function handleLoginClick() {
  // const ticketid = uuid();
  // console.log(ticketid);
  // const url = `/oauth/login?method=github&client=web&ticket_id=${ticketid}&device=web`
  // // window.open(url)
  // axios.post(url).then((res: any) => {
  //   console.log(res)
  // })
}

function Nav() {
  return (
    <nav className={styles['nav-menu']}>
      {/* <a href="/#">Features</a>
      <a href="/#">Pricing</a>
      <a href="/#">Contact</a> */}
      <Link href="https://docs.let.sh">Document</Link>
      <Link href="/blog">Blog</Link>
      <a target="_blank" rel="noopener noreferrer" href="//letapp.kampsite.co/">
        Feature Request
      </a>
      {typeof window !== 'undefined' && window.localStorage.getItem('token') ? (
        <Link href="/console">
          <div className={styles['nav-login']}>
            Visit Console
          </div>
        </Link>
      ) : (
        <div
          onClick={() => {
            location.href = `/login?redirect_to=${encodeURIComponent('/console')}`;
          }}
          className={styles['nav-login']}
        >
          Login / Sign Up
        </div>
      )}

      <div className={styles['nav-login nav-login-font']} onClick={handleLoginClick}></div>
    </nav>
  );
}

export default Nav;
