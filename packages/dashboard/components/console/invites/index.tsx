import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.module.scss';
import Head from 'next/head';
import cls from 'classnames';
import { Invitation, useInviteService } from '../../../service/useInvitesService';
import { LinkOutlined, CopyOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';

function Invites() {
  const id = useSelector((state: RootState) => state.user.id);
  const [invites, setInvites] = useState<Invitation[]>([]);

  const { data, getInviteList } = useInviteService({ id });
  const [setInvitation, { data: inData }] = useMutation<{
    createInvitations: Invitation[];
  }>(gql`
    mutation createInvitations {
      createInvitations(amount: 1) {
        code
        expired
        createdAt
        usedAt
        inviteeName
      }
    }
  `);

  useEffect(() => {
    getInviteList();
  }, [id]);

  useEffect(() => {
    if (data?.haveInvitations) {
      setInvites(data?.haveInvitations);
    }
  }, [data?.haveInvitations.length]);

  useEffect(() => {
    if (inData?.createInvitations[0].code) {
      message.success('Created success');
      setInvites([...invites, ...(inData?.createInvitations || [])]);
    }
  }, [inData?.createInvitations[0].code]);

  return (
    <div className={styles['invites-container']}>
      <Head>
        <title> Invites - let.sh</title>
        <meta name="description" content="Invites Console" />
      </Head>
      <div className="flex items-center mb-10">
        <span className={styles['invites-title']}>Invites</span>
        <Tooltip placement="top" title={'Generate link and copy'}>
          <div
            onClick={() => {
              setInvitation();
            }}
            style={{ fontSize: 16 }}
            className={cls(styles['invites-add-btn'], 'text-white cursor-pointer')}
          >
            Create
          </div>
        </Tooltip>
      </div>
      <div className={styles['invites-card']}>
        <div>
          <div className={styles['invites-title-line']}>
            <div className={styles['invites-line-item']}>Invite Code</div>
            <div className={styles['invites-line-item']}>Invitee</div>
            <div className={styles['invites-line-item']}>Used At</div>
            <div className={styles['invites-line-item']}>Created At</div>
            <div className={styles['invites-line-link']}></div>
          </div>
          {invites?.map((item) => (
            <div className={styles['invites-line']} key={item.code}>
              <div
                className={styles['invites-line-item-code']}
                id={'invite-' + item.code}
                onClick={() => {
                  var dummy = document.createElement('input'),
                    text = 'https://let.sh/invitation?code=' + item.code;

                  document.body.appendChild(dummy);
                  dummy.value = text;
                  dummy.select();
                  document.execCommand('copy');
                  document.body.removeChild(dummy);
                  message.success('copied invite link');
                }}
              >
                {item.code}
              </div>
              <div className={styles['invites-line-item']}>{item.inviteeName || 'Not Yet'}</div>
              <div className={styles['invites-line-item']}>
                {item.usedAt ? dayjs(item.usedAt).fromNow() : 'Not Yet'}
              </div>
              <div className={styles['invites-line-item']}>{dayjs(item.createdAt).fromNow()}</div>
              <div className={styles['invites-line-link']}>
                {item.usedAt ? (
                  <LinkOutlined
                    onClick={() => {
                      message.warning('This invite has been used');
                    }}
                    style={{ fontSize: '15px', color: '#a7a7a7', paddingRight: '10px' }}
                  />
                ) : (
                  <a
                    target="_blank"
                    href={'https://let.sh/invitation?code=' + item.code}
                    style={{ paddingRight: '10px' }}
                    rel="noopener noreferrer"
                  >
                    <LinkOutlined style={{ fontSize: '15px', color: '#0786ff' }} />
                  </a>
                )}

                <CopyOutlined
                  style={{ fontSize: '15px', color: item.usedAt ? '#a7a7a7' : '#0786ff' }}
                  onClick={() => {
                    if (item.usedAt) {
                      message.warning('This invite has been used');
                    } else {
                      var dummy = document.createElement('input'),
                        text = 'https://let.sh/invitation?code=' + item.code;

                      document.body.appendChild(dummy);
                      dummy.value = text;
                      dummy.select();
                      document.execCommand('copy');
                      document.body.removeChild(dummy);
                      message.success('copied invite link');
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles['invites-card-bottom']}>
          remain {5 - (invites?.length || 0) > 0 ? 5 - (invites?.length || 0) : 0} invites
        </div>
      </div>
    </div>
  );
}

export default Invites;
