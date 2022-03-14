import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavLink from 'next/link';
import {
  UserOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  ReadOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { Menu, Dropdown, message } from 'antd';
import { Dispatch, RootState } from 'components/console/store';
import styles from './user.module.scss';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import TagManager from 'react-gtm-module';
import { Route, useLocation, useNavigate, Routes, useParams, Navigate } from 'react-router-dom';

const { SubMenu } = Menu;

const TimeZones = ['Asia/Shanghai', 'America/New_York'];

function User() {
  const { avatar, preference, id, name } = useSelector((state: RootState) => {
    return state.user;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const [setPreference] = useMutation(
    gql`
      mutation setPreference($name: String!, $value: String!) {
        setPreference(name: $name, value: $value)
      }
    `,
    {
      onCompleted() {
        message.success('Change timezone success');
      },
    }
  );

  const menu = useMemo(() => {
    return (
      <Menu
        onClick={({ key, keyPath }: any) => {
          if (keyPath.includes('tz')) {
            dispatch.user.setTimezone(key);
            setPreference({
              variables: {
                name: 'timezone',
                value: key,
              },
            });
          }
        }}
      >
        <Menu.Item
          onClick={() => {
            navigate(`/console/settings`);
          }}
        >
          <SettingOutlined style={{ fontSize: 14 }} />
          Settings
        </Menu.Item>
        <SubMenu
          key={'tz'}
          title="Timezone"
          popupClassName={styles['user-menu']}
          popupOffset={[18, 0]}
          icon={<ClockCircleOutlined style={{ fontSize: 14 }} />}
        >
          {TimeZones.map((tz) => (
            <Menu.Item
              key={tz}
              className={preference.timezone === tz ? styles['dropdown-selected'] : ''}
            >
              {tz}
              {preference.timezone === tz && (
                <CheckCircleFilled
                  style={{
                    fontSize: 14,
                    marginLeft: 10,
                  }}
                />
              )}
            </Menu.Item>
          ))}
        </SubMenu>
        <Menu.Item
          onClick={() => {
            window.open('https://docs.let.sh', '_blank');
          }}
        >
          <ReadOutlined style={{ fontSize: 14 }} />
          Documents
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            localStorage.clear();
            location.href = '/';
          }}
        >
          <LogoutOutlined style={{ fontSize: 14 }} />
          Logout
        </Menu.Item>
      </Menu>
    );
  }, [preference.timezone]);

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        set: 'user_properties',
        name,
      },
    });
    TagManager.dataLayer({
      dataLayer: {
        config: 'G-CQ8XY9WC0V',
        user_id: id,
      },
    });

    window.addEventListener('chatwoot:ready', function () {
      window.$chatwoot.setUser(id, {
        name: name,
        avatar_url: avatar,
      });
      window.$chatwoot.setCustomAttributes({
        user_id: id,
      });
    });
  }, [id, name]);

  return (
    <Dropdown overlay={menu} trigger={['hover']} overlayClassName={styles['user-menu']}>
      <div className={styles['user-header']}>
        <div className={styles['user-right']}>
          <p className="font-bold text-lg px-3 ">{name}</p>
          {avatar ? (
            <img className={styles['user-avatar']} src={avatar} />
          ) : (
            <UserOutlined className={styles['user-avatar']} />
          )}
        </div>
      </div>
    </Dropdown>
  );
}

export default User;
