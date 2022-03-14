import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface ProjectState {
  type: string;
  version: number;
}

export const project = createModel<RootModel>()({
  state: {
    type: '',
    version: -1,
  } as ProjectState,
  reducers: {
    setType(state, type: string) {
      state.type = type;
      return state;
    },
    setversion(state, id: number) {
      state.version = id;
      return state;
    },
  },
});
