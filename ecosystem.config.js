// ecosystem.config.js
// https://pm2.keymetrics.io/

export default {
  apps: [
    {
      name: 'se19_study_planner',
      script: 'bun',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
      },
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
}
