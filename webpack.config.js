const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    context: __dirname,
    entry: {
        "content-script": "./src/content-script.ts",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "./lib-umd"),
        libraryTarget: "umd",
        library: "GithubMarkdownLivePreview",
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            logInfoToStdOut: true,
                            compilerOptions: {
                                "noEmit": false
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        mainFields: ["browser", "module", "js:next", "main"]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: "src/content-script.css"
        }, {
            from: "src/manifest.json"
        }])
    ]
};
