const packageJSON = require('./package.json');

process.env.TZ = 'UTC';

module.exports = {
  verbose: true,
  name: packageJSON.name,
  displayName: packageJSON.name,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: './coverage/',
};
