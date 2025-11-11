import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // Ambiente de testes baseado em navegador
  testEnvironment: 'jsdom',

  // Transforma arquivos TS, JS, HTML corretamente
  transform: {
    // Use o transformador Angular para TS e JS
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
  },

  // Adicione esta chave para mapear a serialização de templates!
  snapshotFormat: {
    printBasicPrototype: false,
    escapeString: false,
  },

  // Transforma dependências ESM do Ionic, Stencil e RxJS
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@ionic|@stencil/core|ionicons|rxjs)/)',
  ],

  // Mapeia módulos e mocks
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^ionicons/components/ion-icon\\.js$':
      '<rootDir>/src/__mocks__/ion-icon.mock.ts',
  },

  // Extensões válidas
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],

  // Ignora pastas comuns
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],

  // Recomendações para Jest + Angular
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true,
      stringifyContentPathRegex: '\\.html$',
    },
  },
};

export default config;
