import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { message, Row, Col } from 'antd';
import styles from './index.module.scss';
import CommonHead from 'components/common/head';
import Logo from '../../components/common/logo/logo';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
  GoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import Footer from 'components/dashboard/footer';
import CardGrid from './cardGrid';

function Invitation() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  let invitationCode = '';
  if (typeof window !== 'undefined') {
    invitationCode = new URLSearchParams(location.search).get('code') || '';
  }
  const [inviteInfo, setInviteInfo] = useState({
    inviter: 'Your friends',
    code: '',
    expired: false,
  });

  const getInviter = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha();
    var error = false;
    const resp = await fetch(`//api.let-sh.com/public/invitation/${invitationCode}`, {
      method: 'get',
      headers: {
        'x-recaptcha-token': token,
      },
    }).then((res) => {
      if (res.status > 300) {
        error = true;
      }
     
      return res.json();
    });

    if (!error) {
      setInviteInfo(resp);
    } else {
      message.error({
        content: resp.message || 'Network Error',
        className: styles['message'],
      });
    }
  }, [executeRecaptcha]);

  const handleReCaptchaVerify = useCallback((token: string) => {}, []);
  let mobile = false;
  if (typeof window !== 'undefined') {
    mobile = window.innerWidth <= 550;
  }

  useEffect(() => {
    getInviter();
  }, [executeRecaptcha]);

  return (
    <div>
      <Head>
        <title> Invitation of let.sh alpha program </title>
        <meta name="description" content="Domains Console" />
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
        // style={{
        //   marginTop: 200,
        // }}
        className={styles['invitation'] + ' text-center flex flex-col justify-center items-center'}
      >
        <div className={styles['invitation-name']}>{inviteInfo.inviter}</div>
        <p className={styles['invitation-main-text']}>Invites you join let.sh alpha program</p>
        <p className={styles['invitation-text']}>supercharge your development process</p>
        <div className={styles['invitation-code-container']}>
          <div className={styles['invitation-code-input']}>
            <span className={styles['invitation-code']}>
              <span style={{ color: 'rgb(0 0 0 / 18%)' }}>#</span> {invitationCode}
            </span>
            <div
              className={styles['join-btn']}
              onClick={() => {
                location.href = `//let.sh/login?invite_code=${invitationCode}`;
              }}
            >
              Join Now
            </div>
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

function WrapInvitation() {
  return (
    <GoogleReCaptchaProvider
      language="zh-cn"
      reCaptchaKey="6LcucPsUAAAAAFxp4fLX-OWK8h6Q9ioIkklQwiP2"
      useRecaptchaNet
    >
      <Invitation />
    </GoogleReCaptchaProvider>
  );
}

export default WrapInvitation;
