require("./check-versions")();

var config = require("../config");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require("opn");
var path = require("path");
var express = require("express");
var webpack = require("webpack");
var proxyMiddleware = require("http-proxy-middleware");
var webpackConfig = require("./webpack.dev.conf");

// default port where dev server listens for incoming traffic
var port = config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

var hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: () => {}
});
// force page reload when html-webpack-plugin template changes
compiler.plugin("compilation", function(compilation) {
  compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
    hotMiddleware.publish({
      action: "reload"
    });
    cb();
  });
});

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context];
  if (typeof options === "string") {
    options = {
      target: options
    };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require("connect-history-api-fallback")());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
app.use(staticPath, express.static("./static"));

var uri = "http://localhost:" + port;
var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

console.log("> Starting dev server...");
devMiddleware.waitUntilValid(() => {
  console.log("> Listening at " + uri + "\n");
  if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
    opn(uri);
  }
  _resolve();
});
// app.all('*', (req, res, next) => {
//   var origin = req.headers.origin;
//   console.log("---ceshi--" + req)
//   console.log(origin)
//   res.header('Access-Control-Allow-Origin', "http://localhost:8080");
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
//   next()
// });

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //带cookies7     res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

var server = app.listen(8081, function() {
  var host = "localhost";
  var port = 8081;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};
