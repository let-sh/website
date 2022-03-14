import React, { useReducer, useEffect, useRef } from 'react';
import { Divider, Input, message } from 'antd';
import CardContainer from 'components/common/CardContainer';
import { Select } from 'antd';

import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../store';
import { GithubFilled, GithubOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import classNames from 'classnames';

const { Option } = Select;

interface Account {
  name: string;
  email: string;
}

interface Preference {
  channel: string;
  timezone: string;
}

const accountReducer = (state: Account, action: any): Account => {
  switch (action.type) {
    case 'name':
      return {
        ...state,
        name: action.payload,
      };
    case 'email': {
      return {
        ...state,
        email: action.payload,
      };
    }
    case 'all': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

const preferenceReducer = (state: Preference, action: any): Preference => {
  switch (action.type) {
    case 'channel':
      return {
        ...state,
        channel: action.payload,
      };
    case 'timezone': {
      return {
        ...state,
        timezone: action.payload,
      };
    }
    case 'all': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

function Settings() {
  const { name, gitHubName, email, preference } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<Dispatch>();
  const defaultAccount = {
    name,
    email: '',
  };
  const defaultPerence = {
    channel: preference.channel,
    timezone: preference.timezone,
  };
  const accountChanged = useRef(false);
  const preferenceChanged = useRef(false);

  const [account, accountDispatch] = useReducer(accountReducer, defaultAccount);
  const [preferenceVal, preferenceDispatch] = useReducer(preferenceReducer, defaultPerence);
  const [setPreference] = useMutation(
    gql`
      mutation setPreference($name: String!, $value: String!) {
        setPreference(name: $name, value: $value)
      }
    `,
    {
      onCompleted() {
        message.success('Change preference success');
      },
    }
  );

  useEffect(() => {
    if (name || email) {
      accountDispatch({
        type: 'all',
        payload: {
          name,
          email,
        },
      });
    }
  }, [name, email]);

  useEffect(() => {
    if (preference.channel || preference.timezone) {
      preferenceDispatch({
        type: 'all',
        payload: {
          channel: preference.channel,
          timezone: preference.timezone,
        },
      });
    }
  }, [preference]);

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>Settings</div>
      <CardContainer
        style={{
          padding: '23px 23px 120px',
          marginTop: '40px',
          marginRight: '10%',
        }}
      >
        <div className={styles['card-title']}>Account Settings</div>
        <Divider />
        <div className="flex">
          <div className={styles['label-container']}>
            <div className={styles['label-title']}>Username</div>
            <div className={styles['label-desc']}>
              {`Username will be used in your deployments, a domain with you username prefix will bereserved for you https://${name}.let.sh. You could directly link domain ${name}.let.sh in your projects`}
            </div>
          </div>
          <div className={styles['input-container']}>
            <Input
              addonBefore={
                <span
                  style={{
                    color: 'rgba(0, 0, 0, 0.4)',
                  }}
                >
                  @
                </span>
              }
              value={account.name}
              disabled
              onChange={(e) => {
                accountChanged.current = true;
                accountDispatch({
                  type: 'name',
                  payload: e.target.value,
                });
              }}
            />
            <div className={styles['username-link']}>{`https://${name}.let.sh`}</div>
          </div>
        </div>
        <div
          className="flex"
          style={{
            marginTop: '24px',
          }}
        >
          <div className={styles['label-container']}>
            <div className={styles['label-title']}>Email</div>
            <div className={styles['label-desc']}>
              Email will be used to send you import notification
            </div>
          </div>
          <div className={styles['input-container']}>
            <Input
              style={{
                borderRadius: '8px',
              }}
              disabled
              value={account.email}
              onChange={(e) => {
                accountChanged.current = true;
                accountDispatch({
                  type: 'email',
                  payload: e.target.value,
                });
              }}
            />
            {/* <div
              className={styles['username-email']}
              style={{
                color: '#FF9D00',
              }}
            >
              Not verified, <a>click</a> to resend verify email.
            </div> */}
          </div>
        </div>
        <Divider />
        <div className="flex">
          <div className={styles['label-container']}>
            <div className={styles['label-title']}>Github</div>
            <div className={styles['label-desc']}>
              We will user GitHub OAuth to help you login in dashboard or cli.
            </div>
          </div>
          <div className={styles['input-container']}>
            <div
              className={styles['github-btn']}
              onClick={() => {
                window.open(`https://github.com/${gitHubName}`);
              }}
            >
              <GithubFilled />
              <span className={styles['github-name']}>{gitHubName}</span>
            </div>
          </div>
        </div>
        {accountChanged.current && (
          <div className={styles['btn-container']}>
            <div
              className={styles['btn-cancel']}
              onClick={() => {
                accountDispatch({
                  type: 'all',
                  payload: defaultAccount,
                });
              }}
            >
              Cancel
            </div>
            <div className={styles['btn-create']}>Create</div>
          </div>
        )}
      </CardContainer>
      <CardContainer
        style={{
          padding: '23px 23px 90px',
          marginTop: '40px',
          marginRight: '10%',
          marginBottom: '120px',
        }}
      >
        <div className={styles['card-title']}>Preference</div>
        <Divider />
        <div className="flex">
          <div className={styles['label-container']}>
            <div className={styles['label-title']}>Default Deploy Channel</div>
            <div className={styles['label-desc']}>
              let.sh currently support dev & prod deployment channel. You can change your deploy
              channel here, and you can also change the channel for each deployment via —dev or
              —prod.{' '}
              <a
                href="https://docs.let.sh/concept/basic#channel"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go Further: Channel Docs
              </a>
            </div>
          </div>
          <div className={styles['input-container']}>
            <Select
              style={{
                borderRadius: 8,
              }}
              className={classNames('ant-select-customize-input', styles['select'])}
              value={preferenceVal.channel}
              onChange={(e) => {
                preferenceChanged.current = true;
                preferenceDispatch({
                  type: 'channel',
                  payload: e,
                });
              }}
            >
              <Option value="prod">Production</Option>
              <Option value="dev">Development</Option>
            </Select>
          </div>
        </div>
        <div
          className="flex"
          style={{
            marginTop: '24px',
          }}
        >
          <div className={styles['label-container']}>
            <div className={styles['label-title']}>Timezone</div>
            <div className={styles['label-desc']}>Timezone to display time in dashboard</div>
          </div>
          <div className={styles['input-container']}>
            <Select
              style={{
                borderRadius: 8,
              }}
              className={classNames('ant-select-customize-input', styles['select'])}
              value={preferenceVal.timezone}
              onChange={(e) => {
                preferenceChanged.current = true;
                preferenceDispatch({
                  type: 'timezone',
                  payload: e,
                });
              }}
            >
              <Option value="Asia/Shanghai">Asia/Shanghai</Option>
              <Option value="America/New_York">America/New_York</Option>
            </Select>
          </div>
        </div>
        {preferenceChanged.current && (
          <div className={styles['btn-container']}>
            <div
              className={styles['btn-cancel']}
              onClick={() => {
                preferenceDispatch({
                  type: 'all',
                  payload: defaultPerence,
                });
              }}
            >
              Cancel
            </div>
            <div
              className={styles['btn-create']}
              onClick={() => {
                dispatch.user.setTimezone(preferenceVal.timezone);
                dispatch.user.setChannel(preferenceVal.channel);
                if (defaultPerence.timezone !== preferenceVal.timezone) {
                  setPreference({
                    variables: {
                      name: 'timezone',
                      value: preferenceVal.timezone,
                    },
                  });
                }
                if (defaultPerence.channel !== preferenceVal.channel) {
                  setPreference({
                    variables: {
                      name: 'channel',
                      value: preferenceVal.channel,
                    },
                  });
                }
              }}
            >
              Create
            </div>
          </div>
        )}
      </CardContainer>
    </div>
  );
}

export default Settings;
