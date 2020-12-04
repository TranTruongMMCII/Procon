module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname + '/dist',
        filename: "main.bundle.js",
        publicPath: 'dist/'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
        ]
    }
}
