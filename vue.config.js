// vue.config.js
module.exports = {
  publicPath: process.env.BASE_URL ? process.env.BASE_URL : "/",
  outputDir: process.env.BASE_URL ? "dist/" + process.env.BASE_URL : "dist",
  devServer: {
    port: 8081,
  },
  chainWebpack: config => {
    config.performance.maxEntrypointSize(1000000).maxAssetSize(1000000);
  },
};
