const webpack = require('webpack');
const babylonExternals = require('./babylonExternals');
const hardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = require("../Config/config.js");

module.exports = function defaultConfig(options) {
    if (!options) {
        throw "Options are mandatory to create the config.";
    }

    const module = options.module;
    const settings = config[module];

    options.resolveExtensions = options.resolveExtensions || [];
    options.moduleRules = options.moduleRules || [];
    options.plugins = options.plugins || [];

    return {
        context: settings.computed.srcDirectory,
        entry: {
            [settings.build.umd.packageName]: settings.libraries[0].computed.entryPath
        },
        output: {
            path: settings.computed.distDirectory,
            filename: settings.libraries[0].output
                .replace(".min.", ".")
                .replace(".max.", "."),
            libraryTarget: 'umd',
            library: {
                root: settings.build.umd.webpackRoot.split("."),
                amd: settings.build.umd.packageName,
                commonjs: settings.build.umd.packageName
            },
            umdNamedDefine: true
        },
        resolve: options.resolve || {
            extensions: [".ts", ...options.resolveExtensions]
        },
        externals: [babylonExternals()],
        devtool: "none",
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: settings.computed.tsConfigPath,
                    declaration: false
                }
            }, ...options.moduleRules]
        },
        mode: "production",
        performance: {
            hints: false
        },
        plugins: [
            //new hardSourceWebpackPlugin(),
            new webpack.WatchIgnorePlugin([
                /\.js$/,
                /\.d\.ts$/,
                /\.fx$/
            ]),
            ...options.plugins
        ]
    }
};