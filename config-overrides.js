const path = require('path');
const { exit } = require('process');

module.exports = {
    paths: function (paths, env) {
        paths.appPath = path.resolve(__dirname, 'front');
        paths.appIndexJs = path.resolve(__dirname, 'front/src/index.js');
        paths.appSrc = path.resolve(__dirname, 'front/src');
        paths.appPublic = path.resolve(__dirname, 'front/public');
        paths.appHtml = path.resolve(__dirname, 'front/public/index.html');
        paths.publicUrlOrPath = "/";
        return paths;
    },
}
