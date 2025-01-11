import '@testing-library/jest-dom';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock de next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock de next/headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
  headers: () => ({
    get: jest.fn(),
    set: jest.fn(),
  }),
}));

// Mock de sonner (toast)
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

jest.mock('sonner', () => ({
  toast: mockToast,
}));

global.toast = mockToast;

// Mock de @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => Promise.resolve({ 
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    getToken: jest.fn(() => Promise.resolve('test-token')),
  })),
  useAuth: jest.fn(() => ({
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    isSignedIn: true,
    isLoaded: true,
    getToken: jest.fn(() => Promise.resolve('test-token')),
  })),
  ClerkProvider: ({ children }) => children,
  useUser: jest.fn(() => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
    isLoaded: true,
    isSignedIn: true,
  })),
}));

// Mock de @clerk/nextjs/server
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => Promise.resolve({ userId: 'test-user-id' })),
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
  },
}));

// Mock des composants UI
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value, defaultValue }) => (
    <div data-testid="select" onClick={e => onValueChange && onValueChange(e)} data-value={value || defaultValue}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ children, placeholder }) => <div data-testid="select-value">{children || placeholder}</div>,
  SelectContent: ({ children }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }) => (
    <div data-testid={`select-item-${value}`} data-value={value} role="option">
      {children}
    </div>
  ),
}));

// Mock global pour Request
global.Request = class {
  constructor() {
    return {};
  }
};

// Mock global pour Response
global.Response = class {
  constructor() {
    return {};
  }
};

// Mock pour fetch avec plus de contrôle
global.fetch = jest.fn((url) => {
  if (url.includes('error')) {
    return Promise.reject(new Error('Fetch error'));
  }
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    headers: new Headers(),
  });
});

// Mock pour clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
  },
  configurable: true,
});

// Mock pour framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn() }),
  useInView: () => ({ ref: jest.fn(), inView: true }),
  useScroll: () => ({ scrollYProgress: 0 }),
})); 