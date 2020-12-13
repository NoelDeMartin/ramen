module.exports = {
    extends: [
        '@noeldemartin/eslint-config-typescript',
        'plugin:vue/vue3-recommended',
    ],
    globals: {
        require: true,
        process: true,
    },
    rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': ['error', { singleline: 3 }],
        'vue/max-len': ['error', {
            code: 120,
            ignoreHTMLAttributeValues: true,
        }],
        'max-len': 'off',
    },
    overrides: [
        {
            files: [
                'tailwind.config.js',
                'postcss.config.js',
                'babel.config.js',
                'vue.config.js',
            ],
            env: { node: true },
        },
    ],
};
