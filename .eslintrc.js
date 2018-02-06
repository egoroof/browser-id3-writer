module.exports = {
    'parserOptions': {
        'ecmaVersion': 2017,
        'sourceType': 'module',
    },
    'env': {
        'es6': true,
        'browser': true,
        'node': true,
        'mocha': true,
    },
    'globals': {
        ID3Writer: false,
    },
    'extends': 'eslint:recommended',
    'rules': {
        'indent': 0,
        'linebreak-style': 0,
        'quotes': [1, 'single'],
        'semi': [2, 'always'],
        'no-var': 2, // require let or const instead of var
        'prefer-arrow-callback': 2, // suggest using arrow functions as callbacks
        'prefer-const': 2, // suggest using const declaration for variables that are never modified after declared
        'prefer-rest-params': 2, // suggest using the rest parameters instead of arguments
        'prefer-spread': 2, // suggest using the spread operator instead of .apply().
        'prefer-template': 2, // suggest using template literals instead of strings concatenation
        'comma-dangle': ['error', {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'never',
            'exports': 'never',
            'functions': 'ignore',
        }],
    },
};
