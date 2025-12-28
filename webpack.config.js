const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const { execSync } = require("child_process");

// Get current git tag/version
function getGitVersion() {
  try {
    // Try to get the latest git tag
    return execSync("git describe --tags --abbrev=0", { encoding: "utf8" }).trim();
  } catch (error) {
    // If no tags exist, use default version
    return "v0.0.0-dev";
  }
}

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";
  const version = getGitVersion();
  const buildTime = new Date().toISOString();

  console.log(`\n📦 Building Paris Nord-Est ${version}`);
  console.log(`⏰ Build time: ${buildTime}\n`);

  return {
    mode: argv.mode || "production",
    entry: "./src/index.js",
    output: {
      // In dev mode, output to root dist/ to avoid dugway watching source/dist/
      // In production, output to source/dist/ for BigCartel deployment
      path: isDev
        ? path.resolve(__dirname, "dist")
        : path.resolve(__dirname, "source/dist"),
      filename: "app.js",
      chunkFilename: "[name].app.js",
      // publicPath tells the browser where to find chunks
      // In dev: load from webpack dev server
      // In prod: load from same directory as main bundle
      publicPath: isDev ? "http://localhost:8080/" : "/dist/",
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
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                api: "modern",
              },
            },
            "postcss-loader",
          ],
        },
        {
          test: /\.css$/i,
          exclude: path.resolve(__dirname, "src"),
          use: ["style-loader", "css-loader"],
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
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        // Inject version info at build time
        __APP_VERSION__: JSON.stringify(version),
        __BUILD_TIMESTAMP__: JSON.stringify(buildTime),
      }),
    ],
    devServer: {
      // In dev mode, serve from root dist/ to avoid dugway watching
      static: isDev
        ? path.resolve(__dirname, "dist")
        : path.resolve(__dirname, "source/dist"),
      watchFiles: isDev
        ? [
            "src/**/*",
            "source/**/*",
            "!source/dist/**/*", // Exclude output directory to prevent circular restarts
          ]
        : false,
      hot: true,
      liveReload: true,
      port: 8080,
      allowedHosts: "all",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      client: {
        webSocketURL: {
          hostname: "localhost",
          pathname: "/ws",
          port: 8080,
          protocol: "ws",
        },
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
    },
  };
};
