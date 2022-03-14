import { Models } from '@rematch/core';
import { project } from './project';
import { user } from './user';

export interface RootModel extends Models<RootModel> {
  project: typeof project;
  user: typeof user;
}

export const models: RootModel = { project, user };
