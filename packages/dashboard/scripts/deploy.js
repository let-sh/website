#!/usr/bin/env node

const spawn = require('cross-spawn');

spawn.sync('yarn build', {
  stdio: 'inherit',
  shell: true,
});

spawn.sync('lets', ['deploy', '--prod'], {
  stdio: 'inherit',
});
