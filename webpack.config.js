const path = require("path");
const fs = require("fs");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MinifyPlugin = require("babel-minify-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const lessToJs = require("less-vars-to-js");

const mode = process.env.NODE_ENV || "development";
const rootDir = {
    dev: path.join(__dirname, "frontend", "dev"),
    dist: path.join(__dirname, "frontend", "dist")
};

const themeVariables = lessToJs(fs.readFileSync(path.join(rootDir.dev, "less", "common", "./ant-theme-vars.less"), "utf8"));

module.exports = {
    // watch: true,
    // watchOptions: {
    //     aggregateTimeout: 100
    // },
    mode: mode,
    devtool: mode !== "production" ? "cheap-module-eval-source-map" : false,
    entry: {
        home: [path.join(rootDir.dev, "js", "home", "index.js")]
    },
    output: {
        path: rootDir.dist,
        filename: "js/[name].bundle.js",
        publicPath: "/"
    },
    optimization: {
        minimizer: [new UglifyJsPlugin({
            cache: true,
            parallel: true
        })],
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                    vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin([rootDir.dist]),
        new CopyWebpackPlugin([
            {
              from: path.join(rootDir.dev, "img"),
              to: path.join(rootDir.dist, "img")
            }
        ]),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css"
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(rootDir.dev, "index.html"),
            filename: "index.html",
            chunks: ["home"]
        }),
        new webpack.ProvidePlugin({
            //$: "jquery",
            //_: "lodash"
        }),
        new webpack.DefinePlugin({
            "process.env": {
              NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new MinifyPlugin(),
        new HardSourceWebpackPlugin()
        //new BundleAnalyzerPlugin()
    ],
    resolve: {
        alias: {
            root: path.resolve(__dirname, "node_modules")
        },
        modules: ["node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react", "stage-0"],
                        plugins: [ 
                            "transform-runtime", 
                            [ "import", { "libraryName": "antd", "style": true } ]
                        ] 
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader", 
                        options: {
                            cacheDirectory: true,
                            javascriptEnabled: true,
                            modifyVars: themeVariables
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                  {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "img/",
                        publicPath: "../img/"
                    }
                  },
                  {
                    loader: "image-webpack-loader",
                    options: { },
                  }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                  {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "fonts/",
                        publicPath: "../fonts/"
                    }
                  }
                ]
            },
        ]
    }
};
