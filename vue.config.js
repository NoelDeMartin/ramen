const { existsSync } = require('fs');
const { resolve, dirname } = require('path');
const isProduction = process.env.NODE_ENV === 'production';

function configureSVG(config) {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();
    svgRule.use('vue-loader').loader('vue-loader-v16');
    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
}

function configureHtml(config) {
    config.plugin('html').tap(args => {
        args[0].title = 'Ramen';
        args[0].description = 'Can you make Ramen? Let\'s find out!';
        args[0].baseUrl = isProduction ? 'https://ramen.noeldemartin.com' : 'http://localhost:8080';

        return args;
    });
}

function configureSourceMaps(config) {
    config.module
        .rule('js-maps')
        .test(/\.m?jsx?$/)
        .enforce('pre')
        .use('source-map-loader')
        .loader('source-map-loader')
        .options({
            filterSourceMappingUrl:
                (url, resourcePath) => existsSync(resolve(dirname(resourcePath), url)) ? 'consume' : 'skip',
        });
}

module.exports = {
    chainWebpack(config) {
        configureSVG(config);
        configureHtml(config);
        configureSourceMaps(config);
    },
};
