module.exports = {
  apps: [
    {
      name: "hatimzone-client",
      script: "server.js",
      cwd: "./.next/standalone",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0"
      }
    }
  ]
};
