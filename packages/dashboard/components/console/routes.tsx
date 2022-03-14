import React from 'react';
import Projects from './projects';
import Domains from './domains';
import Invites from './invites';
import Settings from './settings';
import { Navigate } from 'react-router-dom';

const routes = [
  {
    path: '/console',
    children: [
      {
        path: '/',
        element: <Navigate to="projects" />,
      },
      {
        path: '/projects*',
        element: <Projects />,
      },
      {
        path: '/domains',
        element: <Domains />,
      },
      {
        path: '/invites',
        element: <Invites />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
];

export default routes;
