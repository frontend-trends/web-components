module.exports = function(config) {
    config.set({
      basePath: "",
      frameworks: ["jasmine"],
      files: [
        { pattern: 'test/api/*.json', included: false, served: true},
        { pattern: "test/**/*.test.js", watched: false }
      ],
      proxies: {
        '/demo/api/': '/base/test/api/'
      },
      preprocessors: {
        './test/**/*.test.js': [ 'rollup' ]
      },
      rollupPreprocessor: {
        plugins: [],
        output: {
            format: 'iife', // Helps prevent naming collisions.
            name: 'donut-chart.js', // Required for 'iife' format.
            sourcemap: 'inline', // Sensible for testing.
        },
    },
      exclude: [],
      reporters: ["spec"],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ["ChromeHeadless"],
      singleRun: true,
      concurrency: Infinity
    });
  };