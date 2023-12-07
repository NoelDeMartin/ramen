/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,ts}',
        './node_modules/@aerogel/core/dist/**/*.js',
        './node_modules/@aerogel/plugin-solid/dist/**/*.js',
        './node_modules/@aerogel/histoire/dist/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                solid: {
                    500: '#7c4dff',
                    600: '#6437e3',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
