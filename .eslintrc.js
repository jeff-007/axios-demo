module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [],
    rules: {
        'no-console': process.env.NODE_ENV !== 'production' ? 0 : 2,
        'no-useless-escape': 0,
        'no-empty': 0
    }
}
