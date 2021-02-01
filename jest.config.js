module.exports = {
  roots: [
    '<rootDir>/coursework/src',
    '<rootDir>/template/src'
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coursework/build/',
    '<rootDir>/template/build/',
  ],
  moduleFileExtensions: ['ts', 'js'],
  projects: [
    {
      displayName: { name: 'coursework', color: 'cyan' },
      testMatch: ['<rootDir>/coursework/**/?(*.)test.ts?(x)']
    },
    {
      displayName: { name: 'template', color: 'magenta' },
      testMatch: ['<rootDir>/template/**/?(*.)test.ts?(x)']
    }
  ]
};
