import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface UserState {
  avatar: string;
  name: string;
  id: string;
  isAdmin: boolean;
  gitHubName: string;
  gitHubID: string;
  email: string;
  preference: {
    timezone: string;
    channel: string;
  };
  featureFlag: {
    enableTables: boolean;
  };
}

export const user = createModel<RootModel>()({
  state: {
    avatar: '',
    name: '',
    id: '',
    isAdmin: false,
    gitHubName: '',
    gitHubID: '',
    email: '',
    preference: {
      timezone: 'Asia/Shanghai',
      channel: 'prod',
    },
    featureFlag: {
      enableTables: false,
    },
  },
  reducers: {
    setUser(state, user: Partial<UserState>) {
      return {
        ...state,
        ...user,
      };
    },
    setTimezone(state, tz: string) {
      return {
        ...state,
        preference: {
          ...state.preference,
          timezone: tz,
        },
      };
    },
    setChannel(state, channel: string) {
      return {
        ...state,
        preference: {
          ...state.preference,
          channel,
        },
      };
    },
  },
});
