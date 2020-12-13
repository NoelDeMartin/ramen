function configureSVG(config) {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();
    svgRule.use('vue-loader').loader('vue-loader-v16');
    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
}

function configureTitle(config) {
    config.plugin('html').tap(args => {
        args[0].title = 'Ramen';

        return args;
    });
}

module.exports = {
    chainWebpack(config) {
        configureSVG(config);
        configureTitle(config);
    },
};
