module.exports = {
  apps: [{
    name: "soulevents-frontend",
    cwd: __dirname + "/../..",
    script: ".output/server/index.mjs",
    interpreter: "node",
    env: {
      NODE_ENV: "production",
      HOST: "127.0.0.1",
      PORT: 3000,
      TZ: "UTC"
    }
  }]
}
