process.env.TZ = 'UTC';

module.exports = {
  verbose: true,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.(spec|test).{ts,tsx}'],
  collectCoverage: true,
  coverageDirectory: './coverage/',
};
