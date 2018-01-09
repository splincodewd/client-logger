const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

const config = {
    devtool: !isProd ? 'inline-sourcemap' : false,
    watch: !isProd,
    context: path.resolve("./src"),
    entry: {
        app: "./index.ts",
        vendor: "./vendor.ts"
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].bundle.js",
        sourceMapFilename: "[name].bundle.map"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.ts?$/,
                exclude: ["node_modules"],
                use: ["awesome-typescript-loader", "source-map-loader"]
            },
            {test: /\.html$/, loader: "html-loader"},
            {test: /\.css$/, loaders: ["style-loader", "css-loader"]}
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: push(isProd, [
        new webpack.DefinePlugin({
            "process.env": {
                // eslint-disable-line quote-props
                NODE_ENV: JSON.stringify(nodeEnv),
                "process.env": { NODE_ENV: JSON.stringify(nodeEnv) }
            }
        }),
        new HtmlWebpackPlugin({
            title: "ClientLogger examples",
            template: "!!ejs-loader!src/index.html"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
            filename: "vendor.bundle.js"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false},
            sourceMap: true
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: true
                }
            }
        })
    ], [
        new DashboardPlugin()
    ]),
    profile: true,
    performance: {
        hints: false
    },
    stats: 'verbose',
    devServer: {
        contentBase: path.join(__dirname, "dist/"),
        compress: true,
        port: 3000,
        hot: true
    },
    watchOptions: {
        ignored: [
            './node_modules/**/*',
            './module/**/*',
            './public/**/*',
            './vendor/**/*'
        ]
    }
};

module.exports = config;

function push(isProd, array1, array2) {
    if (!isProd) {
        return [ ...array1, ...array2 ];
    } else {
        return array1;
    }
}
