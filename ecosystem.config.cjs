module.exports = {
  apps: [
    {
      name: "allcamp-server",
      script: "bun",
      args: "dist/index.mjs",
      cwd: "./apps/server",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "allcamp-web",
      script: "bun",
      args: "dist/server/server.js",
      cwd: "./apps/web",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOST: "0.0.0.0",
      },
    },
  ],
};
