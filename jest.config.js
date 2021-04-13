module.exports = {
  testTimeout: 30000,
  roots: [
    '<rootDir>/coursework/src',
    '<rootDir>/template/src',
    '<rootDir>/fixtures',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coursework/build/',
    '<rootDir>/template/build/',
    '<rootDir>/fixtures/**/build/',
  ],
  moduleFileExtensions: ['ts', 'js'],
  projects: [
    {
      displayName: { name: 'coursework', color: 'cyan' },
      testMatch: ['<rootDir>/coursework/**/?(*.)test.ts?(x)'],
      testEnvironment: "node",
    },
    {
      displayName: { name: 'template', color: 'magenta' },
      testMatch: ['<rootDir>/template/**/?(*.)test.ts?(x)']
    }
  ]
};
