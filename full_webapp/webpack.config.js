const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'client/lib/js/src/Main.bs.js'),
    output: {
        path: path.resolve(__dirname, 'web/public/js/dist'),
        filename: 'main.js',
    },
    mode: "development",
};