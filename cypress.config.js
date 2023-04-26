module.exports = {
  projectId: 'qiq9zf',
  // The rest of the Cypress config options go here...
  viewportWidth: 1280,
  viewportHeight: 700,
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  chromeWebSecurity: false,
}
