module.exports = {
    configureWebpack: {
      module: {
        rules: [
          {
            test: /\.(html)$/i,
            use: 'raw-loader',
          },
        ],
      },
    },
  };