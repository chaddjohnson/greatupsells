module.exports = {
  webpack: (config) => {
    // Necessary to use symlinked packages (Lerna creates symlinks in node_modules).
    config.resolve.symlinks = false;

    return config;
  },

  webpackDevMiddleware: (config) => {
    // Don't ignore all node modules.
    config.watchOptions.ignored = config.watchOptions.ignored.filter(
      (ignore) => !ignore.toString().includes('node_modules')
    );

    // Ignore all node modules except those here.
    config.watchOptions.ignored = [
      ...config.watchOptions.ignored,
      /node_modules\/(?!@neatowebsolutions\/.+)/,
      /\@neatowebsolutions\/.+\/node_modules/
    ];

    return config;
  }
};
