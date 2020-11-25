const packageJSON = require('./package.json');

process.env.TZ = 'UTC';

module.exports = {
  name: packageJSON.name,
  globals: {
    'ts-jest': {
      disableSourceMapSupport: true,
    },
  },
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.(spec|test).ts'],
  collectCoverage: true,
  coverageDirectory: './coverage/',
};
