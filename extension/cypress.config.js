const { defineConfig } = require("cypress");

module.exports = defineConfig({
  fixturesFolder: false,
  video: false,
  e2e: {
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    baseUrl: "http://localhost:1234",
  },
});
