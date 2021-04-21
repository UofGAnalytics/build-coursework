module.exports = {
  testTimeout: 30000,
  roots: [
    '<rootDir>/compiler/src',
    '<rootDir>/template/src',
    '<rootDir>/fixtures',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/compiler/build/',
    '<rootDir>/template/build/',
    '<rootDir>/fixtures/**/build/',
  ],
  moduleFileExtensions: ['ts', 'js'],
  projects: [
    {
      displayName: { name: 'compiler', color: 'cyan' },
      testMatch: ['<rootDir>/compiler/**/?(*.)test.ts?(x)'],
      testEnvironment: "node",
    },
    {
      displayName: { name: 'template', color: 'magenta' },
      testMatch: ['<rootDir>/template/**/?(*.)test.ts?(x)']
    }
  ]
};
