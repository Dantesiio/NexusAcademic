import type { Config } from 'jest';

const config: Config = {
  // Base configuration
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    '**/*.(t|j)s',
    // Exclude files that are typically not unit tested
    '!**/main.ts',
    '!**/app.module.ts',
    '!**/scripts/**',
    // Optional exclusions - uncomment if needed
    // '!**/*.module.ts',
    // '!**/*.entity.ts',
    // '!**/*.enum.ts',
  ],
  
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageReporters: [
    'json-summary',
    'text',
    'text-summary',
    'lcov'
  ],
  
  // Coverage thresholds based on your current levels
  coverageThreshold: {
    global: {
      statements: 80, // Currently at 82.39%
      branches: 65,   // Currently at 66.03%
      functions: 70,  // Currently at 70.7%
      lines: 80       // Currently at 81.21%
    },
    './auth/': {
      statements: 80,
      branches: 50,
      functions: 55,
      lines: 75
    },
    './auth/decorators/': {
      statements: 90,
      branches: 65,
      functions: 95,
      lines: 95
    },
    './auth/guards/': {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    },
    './auth/strategies/': {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    },
    './courses/': {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    },
    './students/': {
      statements: 90,
      branches: 75,
      functions: 95,
      lines: 90
    },
    './students/entities/': {
      statements: 80,
      branches: 90,
      functions: 25, // Currently low, consider increasing with more tests
      lines: 80
    },
    './submissions/': {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    },
    './submissions/entities/': {
      statements: 75,
      branches: 95,
      functions: 0,  // Currently at 0%, consider testing entity methods
      lines: 70
    }
  },
  
  // Verbose output for better test insights
  verbose: true
};

export default config;