import { Development } from 'service/useDevelopmentPoll';

interface Action {
  payload?: any;
  type: string;
}

export const ACTION = {
  Reset: 'RESET',
  Add: 'Add',
};

export function onlineRequestReducer(state: Development[], action: Action) {
  switch (action.type) {
    case ACTION.Reset: {
      return [];
    }
    case ACTION.Add: {
      return [action.payload, ...state];
    }
    default:
      return state;
  }
}
