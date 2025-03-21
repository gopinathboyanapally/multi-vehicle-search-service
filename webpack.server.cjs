const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: 'production',
    entry: {
        bundle: './src/app.mjs',
    },
    target: "node",
    externals: [nodeExternals()], // Prevents bundling Node modules
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "server.[name].cjs"
    },
    resolve: {
        extensions: [".js", ".mjs"]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};