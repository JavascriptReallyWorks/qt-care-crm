const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const FileSystem = require("fs");

module.exports = {
    entry: "./app/public/crm/cs.js",


    watch: true,
    output: {
        path: path.resolve(__dirname, './app/public/build'),
        filename: 'src/[name].[chunkhash].js'
    },

    module: {
        loaders: [
            { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate-loader!babel-loader' },

            {
                test: /\.html$/,
                use: [
                    { loader:'ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, './app')) },
                    { loader: 'html-loader?name=asset/[name].[ext]' }
                ],
                //loader: 'html-loader?name=asset/[name].[ext]'
            },
            {
                test: /\.jade/,
                loader: 'jade-loader?name=asset/[name].[ext]'
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader?name=asset/[name].[ext]" },
                    { loader: "css-loader?name=asset/[name].[ext]" }
                ]
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader?name=asset/[name].[ext]'
            },
            {
                test: /\.png$/,
                loader: 'file-loader?name=asset/[name].[ext]'
            },
            {
                test: /\.jpg$/,
                loader: 'file-loader?name=asset/[name].[ext]'
            },
            { test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader?name=asset/[name].[ext]" },

        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: false
        }),
        new webpack.ProvidePlugin({
            // npm install jquery@2.1.4 --save, 更高版本其他插件出现不兼容
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery'
        }),
        function() {
            this.plugin('done', function(statsData) {
                const stats = statsData.toJson();
                if (!stats.errors.length) {
                    const htmlFileName = path.join(__dirname, 'app/view/cs.jade');
                    const html = FileSystem.readFileSync(htmlFileName, 'utf8');

                    const htmlOutput = html.replace(
                        /src\/main\.?(.*)js/i,
                        stats.assetsByChunkName.main
                    );

                    FileSystem.writeFileSync(
                        htmlFileName,
                        htmlOutput
                    );
                }
            });
        }

    ],

    resolve: {
        modules: [
            __dirname + '/node_modules',
            'app/public/bower_components'
        ]
    }
};