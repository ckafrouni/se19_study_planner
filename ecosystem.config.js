// ecosystem.config.js
// https://pm2.keymetrics.io/

module.exports = {
  apps: [
    {
      name: 'se19_study_planner',
      script: 'bun run --cwd packages/app start',
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
