const nextJest = require('next/jest.js');

// Build Next-aware configs per project so TS/TSX + JSX transform works
const createJestConfig = nextJest({ dir: './' });

const testPathIgnore = [
  '<rootDir>/node_modules/',
  '<rootDir>/.next/',
  '<rootDir>/generated/',
  '<rootDir>/.github/',
];

const baseMappers = {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^~/(.*)$': '<rootDir>/$1',
  '^@helper/(.*)$': '<rootDir>/helper/$1',
  '\\.(css|less|sass|scss)$': '<rootDir>/test/styleMock.ts',
};

const shared = {
  clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    'jest.config.ts',
    'next.config.ts',
  ],
  testPathIgnorePatterns: testPathIgnore,
  moduleDirectories: ['node_modules', '<rootDir>/'],
};

const frontendCustom = {
  ...shared,
  displayName: 'frontend',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/components/**/*.{spec,test}.{ts,tsx}',
    '<rootDir>/src/app/**/*.{spec,test}.{ts,tsx}',
    '<rootDir>/src/services/client/**/*.{spec,test}.{ts,tsx}',
  ],
  // exclude API routes from FE project to avoid double-running
  testPathIgnorePatterns: [...testPathIgnore, '<rootDir>/src/app/api/'],
  moduleNameMapper: baseMappers,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

const backendCustom = {
  ...shared,
  displayName: 'backend',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/app/api/**/*.{spec,test}.{ts,tsx}',
    '<rootDir>/src/app/**/route.{spec,test}.{ts,tsx}',
    '<rootDir>/src/services/server/**/*.{spec,test}.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^@helper/(.*)$': '<rootDir>/helper/$1',
  },
};

module.exports = async () => {
  const frontend = await createJestConfig(frontendCustom)();
  const backend = await createJestConfig(backendCustom)();
  return { projects: [frontend, backend] };
};
