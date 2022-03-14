import React, { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import { message } from 'antd';
import styles from './index.module.scss';
import CommonHead from 'components/common/head';
import Logo from 'components/common/logo/logo';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
  GoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import Footer from 'components/dashboard/footer';
import CardGrid from 'pages/invitation/cardGrid';

function Join() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  let mobile = false;
  if (typeof window !== 'undefined') {
    mobile = window.innerWidth <= 550;
  }

  const clickHandler = useCallback(async () => {
    setLoading(true);
    if (!executeRecaptcha) {
      return;
    }
    const token = await executeRecaptcha();
    var error = false;
    const res = await fetch('//api.let-sh.com/public/earlyaccess', {
      method: 'post',
      headers: {
        'x-recaptcha-token': token,
      },
      body: JSON.stringify({
        email,
      }),
    }).then((res) => {
      if (res.status > 300) {
        error = true;
      }
      setLoading(false);
      return res.json();
    });
    console.log(res);
    if (!error) {
      message.success({
        content: res.message,
        className: styles['message'],
      });
    } else {

      message.error({
        content: res.message || 'Network Error',
        className: styles['message'],
      });
    }
  }, [executeRecaptcha, email]);

  const handleReCaptchaVerify = useCallback((token: string) => {}, []);

  return (
    <div>
      <Head>
        <title>Join let.sh alpha program</title>
        <meta name="description" content="Join let.sh alpha program" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@let_dot_sh" />
        <meta name="twitter:domain" content="let.sh" />
        <meta name="twitter:title" content="Join let.sh alpha program" />
        <meta name="twitter:description" content="let.sh is an all-in-one dev & deploy platform" />
        <meta name="twitter:image" content="https://let.sh/img/join-twitter-cover.png" />
        <meta property="og:image" content="https://let.sh/img/join-twitter-cover.png" />
      </Head>
      <style global jsx>{`
        .ant-message {
          top: 120px;
        }
        .grecaptcha-badge {
          visibility: hidden;
        }
      `}</style>
      <CommonHead />
      <Logo className={styles['logo']} />

      <div
        className={`text-center flex flex-col justify-center items-center ${styles['join-text-container']}`}
      >
        <p className={styles['join-main-text']}>Request to join let.sh alpha program</p>
        <p className={styles['join-text']}>supercharge your development proccess</p>
        <p className={styles['join-redir-login']}>
          already in? <a href="https://let.sh/login">login here</a>
        </p>
        <div className={styles['join-email-input-wrapper']}>
          <div className={styles['join-email-input']}>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
              className={styles['input']}
              type="email"
              placeholder="email me my invitation"
            />
            <div
              className={styles['invite-btn']}
              onClick={clickHandler}
              style={{
                backgroundColor: loading ? '#ccc' : '#0786ff',
              }}
            >
              {loading ? 'Inviting...' : 'Invite me'}
            </div>
            {/* <div>
            <a href="https://survey.larksuite.com/m?t=s2uxe6r9urvi-pskk" target="_blank">
              <div className={styles['invite-btn']} onClick={clickHandler}>
                Invite me
              </div>
            </a>
          */}
          </div>
          <div className={styles['tos']}>
            <small>
              This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy"> Privacy Policy </a> and
              <a href="https://policies.google.com/terms"> Terms of Service </a> apply.
            </small>
          </div>
        </div>
      </div>
      <GoogleReCaptcha onVerify={handleReCaptchaVerify} />
      <CardGrid />
      {!mobile && <Footer />}
    </div>
  );
}

function WrapJoin() {
  return (
    <GoogleReCaptchaProvider
      language="zh-cn"
      reCaptchaKey="6LcucPsUAAAAAFxp4fLX-OWK8h6Q9ioIkklQwiP2"
      useRecaptchaNet
    >
      <Join />
    </GoogleReCaptchaProvider>
  );
}

export default WrapJoin;
