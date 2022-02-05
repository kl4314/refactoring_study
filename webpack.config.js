const path = require('path')
module.exports = {
    entry : './ch_01/ex/js/app.js',
    output : {
        path : path.resolve(__dirname, 'dist'),
        filename : 'app.bundle.js'
    },
    module : {
        rules : [{test : /\.js$/, use: 'babel-loader'}],
    },
    optimization : {minimizer : []}
}