import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';
import { GithubFilled, GithubOutlined, WechatOutlined } from '@ant-design/icons';
import QRCode from 'qrcode';
import TagManager from 'react-gtm-module';
import styles from './index.module.scss';
import { v4 } from 'uuid';
import ClientOnly from 'components/common/ClientOnly';
import CommonHead from 'components/common/head';
import Header from 'components/dashboard/header';
import Logo from 'components/common/logo/logo';
import Nav from 'components/dashboard/header/Nav';
import { Modal } from 'antd';


const GithubLogin = () => {
  const router = useRouter();
  const [qrcode, setQRCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginOK, setIsLoginOK] = useState(false);
  const [message, setMessage] = useState('');
  const [btnClicked, setBtnClicked] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  
  const { redirect_to, type: typeStr } = qs.parse(location?.search, {
    ignoreQueryPrefix: true,
  });
  const previousPath = `https://${window.location.host}/login?redirect_to=${
    redirect_to || '/console'
  }`;

  const [type, setType] = useState(typeStr);

  const githubLogin = () => {
    setIsLoading(true);
    setBtnClicked('github');
    const ticketId = v4();
    const inviteCode = new URLSearchParams(location.search).get('invite_code');
    localStorage.setItem('ticket_id', ticketId);
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_login',
        event_category: 'login',
        event_label: 'github',
        ticket_id: ticketId,
        invite_code: inviteCode,
      },
    });
    window.location.replace(
      `https://api.let-sh.com/oauth/login?${
        inviteCode ? `invite_code=${inviteCode}&` : ''
      }method=github&client=web&previous_path=${encodeURIComponent(
        `${previousPath}&type=github`
      )}&ticket_id=${ticketId}`
    );
  };

  const weixinLogin = () => {
    setBtnClicked('wechat');
    const ticketId = v4();
    const inviteCode = new URLSearchParams(location.search).get('invite_code');
    localStorage.setItem('ticket_id', ticketId);
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_login',
        event_category: 'login',
        event_label: 'wechat',
        ticket_id: ticketId,
        invite_code: inviteCode,
      },
    });
    fetch(
      `https://api.let-sh.com/oauth/login/wechat?${
        inviteCode ? `invite_code=${inviteCode}&` : ''
      }method=wechat&service=web&previous_path=${encodeURIComponent(
        `${previousPath}&type=wechat`
      )}&ticket_id=${ticketId}`
    )
      .then((res) => res.json())
      .then(async (res) => {
        const code = await QRCode.toDataURL(res.data);
        setType('wechat');
        setQRCode(code);
        setIsModalVisible(true);
        // Modal.info({
        //   content: (
        //     <div>
        //       <img src={code} />
        //     </div>
        //   ),
        //   centered: true,
        //   okText: 'Cancel',
        // });
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  useEffect(() => {
    if (!type) {
      return;
    }
    const ticketId = localStorage.getItem('ticket_id');
    if (ticketId) {
      const controller = new AbortController();
      const { signal } = controller;
      const checkLogin = async function (onFail: () => void, onError: (message: string) => void) {
        try {
          const resp = await fetch(`https://api.let-sh.com/oauth/ticket/${ticketId}`, {
            signal,
            credentials: 'same-origin',
          });
          if (resp.status === 200) {
            const { data } = await resp.json();
            if (typeof data === 'object' && data !== null) {
              const { token } = data;
              localStorage.setItem('token', token);
              localStorage.removeItem('ticket_id');
              setIsLoginOK(true);

              TagManager.dataLayer({
                dataLayer: {
                  event: 'login_succeed',
                  event_category: 'login',
                  event_label: type,
                },
              });
              const { redirect_to: redirectTo } = qs.parse(location?.search, {
                ignoreQueryPrefix: true,
              });
              if (typeof redirectTo === 'string') {
                setRedirectTo(decodeURIComponent(redirectTo || '/console'));
              }
            } else {
              onFail();
            }
          } else {
            const { message } = await resp.json();
            onError(message);
          }
        } catch {}
      };

      switch (type) {
        case 'github': {
          checkLogin(
            () => {
              setMessage('bad data');
              setIsLoginOK(false);
            },
            (message) => {
              setMessage(message);
              setIsLoginOK(false);
            }
          );
          return;
        }
        case 'wechat': {
          function pollLogin() {
            setTimeout(() => {
              checkLogin(
                () => pollLogin(),
                () => pollLogin()
              );
            }, 3000);
          }
          checkLogin(pollLogin, pollLogin);
          return;
        }
      }

      return () => {
        controller.abort();
      };
    } else {
      setRedirectTo('/');
      return;
    }
  }, [type]);

  if (redirectTo !== '') {
    console.log(redirectTo);
    router.push(redirectTo);
  }

  return (
    <div>
      <div className="flex">
        <div className={styles['left-container']}>
          <Logo className={styles['logo']} reverse />
          <div className={styles['code']} />
          <p className={styles['text1']}>One click, from local to cloud</p>
          <p className={styles['text2']}>
            let.sh helps you build services lighting fast, and deploy them like a piece of cake.
          </p>
        </div>
        <div className={styles['right-container']}>
          <Nav />
          <div className={styles['text3']}>Login</div>
          <div className={styles['text4']}>To let.sh</div>
          <div className={styles['text5']}>supercharge your development proccess</div>
          <div
            className={styles['github']}
            onClick={() => {
              githubLogin();
            }}
          >
            <GithubOutlined style={{ fontSize: '22px' }}/>
            <span>{isLoading ? 'Signing to GitHub' : 'Sign in with GitHub'}</span>
          </div>
          <div
            className={styles['wechat']}
            onClick={() => {
              weixinLogin();
            }}
          >
            <WechatOutlined style={{ fontSize: '22px' }} />
            <span>{'Sign in with WeChat'}</span>
          
          </div>
          
          <Modal visible={isModalVisible} onCancel={handleCancel} destroyOnClose={true} okText={null} footer={null} closable={false} centered={true}>
            <div className='m-auto'>
              <img src={qrcode} className='m-auto' />
            </div>
          </Modal>
          <div className={styles['text6']}>
            if you haven’t enrolled our <a>alpha program</a>, this will lead you to invite page{' '}
          </div>
          <div className={styles['text7']}>Copyright © let.sh</div>
        </div>
      </div>
    </div>
  );
};

const GithubLoginApp = () => (
  <ClientOnly>
    <CommonHead />
    <GithubLogin />
  </ClientOnly>
);

export default GithubLoginApp;
