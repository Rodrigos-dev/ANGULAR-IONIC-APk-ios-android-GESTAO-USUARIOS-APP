//import 'jest-preset-angular/setup-jest';  //absoleto antes do jest-presete-angular 14

// src/setup-jest.ts
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone'; // aki e a debaixo importa para versao maior que jest-presete-angular 14
// Inicializa o ambiente de testes com Zone.js
setupZoneTestEnv(); // aki e a de cima importa para versao maior que jest-presete-angular

// -----------------------------------------------------------------------------
// MOCKS DE AMBIENTE BÁSICO
// -----------------------------------------------------------------------------

// Mock global do CSS
Object.defineProperty(window, 'CSS', { value: null });

// Mock do documento
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});

// Mock do getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    display: 'none',
    appearance: ['-webkit-appearance'],
  }),
});

// -----------------------------------------------------------------------------
// MOCKS DE LOCALSTORAGE E SESSIONSTORAGE
// -----------------------------------------------------------------------------

// Usa funções jest.fn() para permitir assertions nos testes (melhor prática)
const storageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

Object.defineProperty(window, 'localStorage', { value: storageMock() });
Object.defineProperty(window, 'sessionStorage', { value: storageMock() });

// -----------------------------------------------------------------------------
// MOCKS DE ANIMAÇÃO
// -----------------------------------------------------------------------------

Object.defineProperty(window, 'requestAnimationFrame', {
  value: (callback: FrameRequestCallback) => setTimeout(callback, 0),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: (id: number) => clearTimeout(id),
});

// -----------------------------------------------------------------------------
// MOCKS ADICIONAIS (RECOMENDADOS PARA IONIC/ANGULAR)
// -----------------------------------------------------------------------------

// Mock de matchMedia (usado por Angular CDK e Ionic)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
