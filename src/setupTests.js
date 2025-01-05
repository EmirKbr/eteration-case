import '@testing-library/jest-dom';
class TextEncoderPolyfill {
  encode(string) {
    const encoder = new util.TextEncoder();
    return encoder.encode(string);
  }
}

class TextDecoderPolyfill {
  decode(uint8array) {
    const decoder = new util.TextDecoder();
    return decoder.decode(uint8array);
  }
}

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoderPolyfill;
  global.TextDecoder = TextDecoderPolyfill;
}
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  
  // Mock ResizeObserver
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  window.ResizeObserver = ResizeObserverMock;