module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Polyfill'leri önce yükle
      ["module:react-native-dotenv"],
      ["@babel/plugin-transform-runtime", {
        "regenerator": true
      }]
    ]
  };
};