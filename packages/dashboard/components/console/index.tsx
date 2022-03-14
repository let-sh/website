import React, { useMemo } from 'react';
import Logo from '../../components/common/logo/logo';
import styles from './console.module.scss';
import User from './user/user';
import cls from 'classnames';
import { LinkOutlined, SettingOutlined, ProjectOutlined, UserAddOutlined } from '@ant-design/icons';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';
import { gql } from '@apollo/client';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import routes from './routes';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'components/console/store';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import { useLazyQuery, useQuery } from '@apollo/client';
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {}

const USER_QUERY = gql`
  query {
    user {
      id
      name
      isAdmin
      avatar
      gitHubName
      gitHubID
      email
      # featureFlag {
      #   enableTables
      # }
    }
  }
`;

const Preference_QUERY = gql`
  query {
    allPreference {
      timezone
      channel
    }
  }
`;

const Console: React.FunctionComponent<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const RouterElement = useRoutes(routes);
  const dispatch = useDispatch<Dispatch>();

  const basePathname = '/console';

  const menu = useMemo(
    () => [
      {
        path: `${basePathname}/projects`,
        name: 'Projects',
        icon: ProjectOutlined,
      },
      {
        path: `${basePathname}/domains`,
        name: 'Domains',
        icon: LinkOutlined,
      },
      {
        path: `${basePathname}/invites`,
        name: 'Invites',
        icon: UserAddOutlined,
      },
      {
        path: `${basePathname}/settings`,
        name: 'Settings',
        icon: SettingOutlined,
      },
    ],
    [basePathname]
  );

  const iconMatch = useMemo(
    () => (props: string) => {
      for (const item of menu) {
        if (item.path === props) {
          return <item.icon />;
        }
      }
    },
    [menu]
  );

  const { loading, data } = useQuery(USER_QUERY);
  const [getPreference, { data: preferenceData }] = useLazyQuery(Preference_QUERY);

  useEffect(() => {
    if (loading === false && !data) {
      const currentFullPath = `${location.pathname}${location.search}${location.hash}`;
      const loginPath = `https://${window.location.host}/login?redirect_to=${encodeURIComponent(
        currentFullPath
      )}`;
      window.location.href = loginPath;
    } else {
      getPreference();
    }

    if (loading === false && data) {
      dispatch.user.setUser(data.user);
      TagManager.dataLayer({
        dataLayer: {
          event: 'visit_console',
          event_category: 'console',
          event_label: 'console',
          username: data.user.name,
        },
      });
    }

    if (preferenceData) {
      dispatch.user.setUser({
        preference: preferenceData.allPreference,
      });
    }
  }, [loading, data, location.pathname, location.search, location.hash, preferenceData]);

  if (!data || loading) {
    return null;
  }

  return (
    <div className={styles['console-wrapper']}>
      <div className={styles['console-sider']}>
        <div className={styles['console-logo']}>
          <Logo />
        </div>
        <div className={styles['console-menulist-wrapper']}>
          {menu.map((item) => (
            <div
              key={item.path}
              style={{ textDecoration: 'none' }}
              onClick={() => navigate(item.path)}
            >
              <div
                className={cls(styles['console-menuitem'], {
                  [styles['active']]: location.pathname.includes(item.path),
                })}
              >
                <span className={styles['console-icon']}>{iconMatch(item.path)}</span>
                <span className={styles['console-title']}>{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles['console-content']}>
        <User />
        {RouterElement}
      </div>
    </div>
  );
};

export default Console;
