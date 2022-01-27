// const esModules = ['chalk', 'to-vfile'].join('|');

module.exports = {
  // verbose: true,
  extensionsToTreatAsEsm: ['.ts'],
  // transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  testTimeout: 30000,
  // roots: [
  //   '<rootDir>/compiler/src',
  //   '<rootDir>/template/src',
  //   '<rootDir>/fixtures',
  // ],
  // watchPathIgnorePatterns: [
  //   '<rootDir>/node_modules/',
  //   '<rootDir>/compiler/build/',
  //   '<rootDir>/template/build/',
  //   '<rootDir>/fixtures/**/build/',
  // ],
  // moduleFileExtensions: ['ts', 'js'],
  // projects: [
  //   {
  //     displayName: { name: 'compiler', color: 'cyan' },
  //     testMatch: ['<rootDir>/compiler/**/*(*.)test.ts?(x)'],
  //     testEnvironment: "node",
  //   },
  //   {
  //     displayName: { name: 'template', color: 'magenta' },
  //     testMatch: ['<rootDir>/template/**/*(*.)test.ts?(x)']
  //   }
  // ],
  moduleNameMapper: {
    "\\assets/(.*)": "<rootDir>/test-utils/file-mock.js",
    "\\template/build/(.*)": "<rootDir>/test-utils/file-mock.js",
    "#(.*)": "<rootDir>/node_modules/$1"
  },
};
