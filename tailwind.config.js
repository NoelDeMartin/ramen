module.exports = {
    purge: ['./src/**/*.{vue,ts}'],
    theme: {
        fontFamily: {
            ubuntu: ['"Ubuntu"', 'sans-serif'],
        },
        extend: {
            colors: {
                solid: {
                    500: '#7c4dff',
                    600: '#6437e3',
                    700: '#4e24c1',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
