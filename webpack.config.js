const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "source/dist"),
    filename: "app.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(css|html|scss)$/i,
        include: path.resolve(__dirname, "src"),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.css$/i,
        exclude: path.resolve(__dirname, "src"),
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(woff(2)?|ttf|otf|eot)$/,
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(svg)$/,
        generator: {
          filename: "assets/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new VueLoaderPlugin(),
  ],
  devServer: {
    static: path.resolve(__dirname, "source/dist"),
    watchFiles: ["source/**/*"],
    hot: true,
  },
};
