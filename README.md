<div align="center">
  <img src="logo/btc-ui.png" alt="Bitcoin UI" width="200" height="200" />
  
  # Bitcoin UI

  Modern, accessible React component library for Bitcoin applications. Built with TypeScript and designed following the [Bitcoin Design Guide](https://bitcoin.design/guide/) and [Bitcoin Universal Design Accessibility Standards](https://jason-me.github.io/bitcoin-universal-design/).

  [![npm version](https://img.shields.io/npm/v/bitcoin-ui.svg)](https://www.npmjs.com/package/bitcoin-ui)
  [![Tests](https://img.shields.io/badge/tests-64%20passing-brightgreen)](src/__tests__)
  [![Components](https://img.shields.io/badge/components-5-blue)](#-components)
  [![Storybook](https://img.shields.io/badge/storybook-live-ff4785)](https://bitcoin-ui-kit.github.io/bitcoin-ui)
  [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

  **🌐 [Live Website & Documentation →](https://bitcoinui.org/)**
  **📚 [Live Storybook →](https://bitcoin-ui-kit.github.io/bitcoin-ui)**
</div>

## ✨ Features

- 🎨 **Beautiful by Default** - Clean, modern styling
- ♿ **Fully Accessible** - WCAG 2.1 AA compliant with screen reader support
- 🎯 **Minimal Dependencies** - Only requires React, Radix UI, react-copy-to-clipboard-ts, and qrcode.react
- 🌙 **Dark Mode Ready** - Automatic dark mode support via CSS custom properties
- 🌍 **Locale-Aware** - Support for US, EU number formatting
- ₿ **Bitcoin-Specific** - Designed for Bitcoin applications
- 📱 **Mobile-First** - Responsive and touch-friendly
- 🔒 **Security-Focused** - Secure handling of sensitive data
- 🧪 **Thoroughly Tested** - 64+ tests including accessibility & story tests
- 🚀 **Lightweight** - Minimal bundle size impact

## 📦 Installation

```bash
npm install bitcoin-ui
# or
yarn add bitcoin-ui
# or
pnpm add bitcoin-ui
```

## 🎨 Interactive Examples

**🚀 [View Live Components →](https://bitcoinui.org/playground)**

Explore all components interactively with different props, styling examples, and live code examples.

For local development with Storybook:

```bash
# Clone the repository
git clone <repository-url>
cd bitcoin-ui
pnpm install

# Start Storybook
pnpm storybook
```

Then open [http://localhost:6006](http://localhost:6006) for local development.

## 🚀 Quick Start

```tsx
import { Secret, PasswordInput, QRCode, ExpandableText, CurrencyInput } from 'bitcoin-ui'

function App() {
  const [password, setPassword] = useState('')
  const [amount, setAmount] = useState('')

  return (
    <div>
      {/* Secure display of sensitive information */}
      <Secret 
        secret="abandon ability able about above absent absorb abstract absurd abuse access accident"
        label="Seed Phrase"
      />

      {/* Password input with reveal/hide toggle */}
      <PasswordInput
        label="Wallet Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Currency input with locale-aware formatting */}
      <CurrencyInput
        currency="BTC"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        label="Bitcoin Amount"
      />

      {/* QR code with copy functionality */}
      <QRCode
        value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        label="Bitcoin Address QR"
        size={200}
      />

      {/* Expandable text for long addresses */}
      <ExpandableText
        text="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        type="address"
        label="Bitcoin Address"
      />
    </div>
  )
}
```

## 🧩 Components

### 🔐 Secret
Securely display and copy sensitive information like seed phrases and private keys.

```tsx
<Secret
  secret="correct horse battery staple"
  label="Seed Phrase"
  maskChar="•"
  showCopyButton={true}
/>
```

**Props:**
- `secret: string` - The sensitive text to display
- `label?: string` - Accessible label for the secret
- `maskChar?: string` - Character to use for masking (default: "•")
- `showCopyButton?: boolean` - Whether to show copy button (default: true)

### 🔑 PasswordInput
Accessible password input with reveal/hide toggle functionality.

```tsx
<PasswordInput
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
  autoComplete="new-password"
/>
```

**Props:**
- `label?: string` - Accessible label for the input
- All standard HTML input props (value, onChange, placeholder, etc.)

### 📱 QRCode
Generate and display QR codes with copy functionality.

```tsx
<QRCode
  value="bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  label="Bitcoin Address QR"
  size={200}
  errorCorrectionLevel="M"
  description="Scan to send Bitcoin"
/>
```

**Props:**
- `value: string` - The data to encode in the QR code
- `label: string` - Accessible label for the QR code
- `size?: number` - Size of the QR code in pixels (default: 200)
- `errorCorrectionLevel?: "L" | "M" | "Q" | "H"` - Error correction level (default: "M")
- `description?: string` - Additional description for accessibility

### 📄 ExpandableText
Display long text with expand/collapse and copy functionality.

```tsx
<ExpandableText
  text="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  type="address"
  label="Bitcoin Address"
  startChars={6}
  endChars={8}
  showCopyButton={true}
/>
```

**Props:**
- `text: string` - The text to display
- `type?: "address" | "invoice" | "text"` - Type of text for accessibility
- `label?: string` - Accessible label
- `startChars?: number` - Characters to show at start when truncated (default: 6)
- `endChars?: number` - Characters to show at end when truncated (default: 8)
- `showCopyButton?: boolean` - Whether to show copy button (default: true)

### 💰 CurrencyInput
Locale-aware currency input with real-time formatting and validation.

```tsx
<CurrencyInput
  currency="BTC"
  locale="US"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  label="Bitcoin Amount"
  placeholder="0.021"
/>
```

**Props:**
- `currency: "BTC" | "USD" | "EUR"` - Currency type
- `locale?: "US" | "EU"` - Locale for number formatting (default: "US")
- `label?: string` - Accessible label for the input
- All standard HTML input props (value, onChange, placeholder, etc.)

**Locale Formatting:**
- **US**: `1,234.56` (comma thousands, dot decimal)
- **EU**: `1.234,56` (dot thousands, comma decimal)

## 🎨 Styling & Customization

All components are flexible by default and come with beautiful styling using modern design tokens.

### Default Styling

Components include beautiful default styling that you can optionally use:

```tsx
// Import default styles (optional)
import 'bitcoin-ui/styles.css';
```

### Custom Theming

Override CSS custom properties to customize the design:

```css
:root {
  /* Colors */
  --btc-gray-50: #your-color;
  --btc-gray-900: #your-color;
  --btc-orange-500: #your-accent-color;
  
  /* Typography */
  --btc-font-family: 'Your Font', sans-serif;
  --btc-font-mono: 'Your Mono Font', monospace;
  
  /* Spacing */
  --btc-space-4: 1.5rem;
  
  /* Border radius */
  --btc-radius-lg: 0.75rem;
}
```

### Component-Specific CSS Classes

Each component exposes specific CSS classes for styling:

```css
/* Secret component */
.secret { /* wrapper */ }
.secret__text { /* text display */ }
.secret__toggle { /* reveal/hide button */ }
.secret__copy { /* copy button */ }

/* Password input */
.password-input { /* wrapper */ }
.password-input__input { /* input field */ }
.password-input__toggle { /* visibility toggle */ }

/* QR code */
.qr-code { /* wrapper */ }
.qr-code__svg { /* QR code SVG */ }
.qr-code__copy { /* copy button */ }

/* Expandable text */
.expandable-text { /* wrapper */ }
.expandable-text__content { /* text content */ }
.expandable-text__toggle { /* expand/collapse button */ }

/* Currency input */
.currency-input { /* wrapper */ }
.currency-input__symbol { /* currency symbol */ }
.currency-input__input { /* input field */ }
```

### Dark Mode

Components automatically support dark mode through CSS custom properties:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --btc-gray-50: #111827;
    --btc-gray-900: #f9fafb;
    /* Colors are automatically inverted */
  }
}
```

### Inline Styles
Pass styles directly to components:

```tsx
<Secret
  secret="my secret"
  style={{ padding: '1rem', backgroundColor: 'white' }}
/>
```

### CSS-in-JS
Use your preferred CSS-in-JS solution:

```tsx
const StyledSecret = styled(Secret)`
  padding: 1rem;
  background: white;
  border-radius: 8px;
`
```

## 🔧 TypeScript Support

Full TypeScript support with exported types:

```tsx
import type { 
  SecretProps, 
  PasswordInputProps, 
  QRCodeProps,
  ExpandableTextProps,
  CurrencyInputProps,
  Currency,
  Locale 
} from 'bitcoin-ui'
```

## 🚀 Advanced Usage

### Custom Toast Notifications

```tsx
import { showToast } from 'bitcoin-ui';

// Success notification
showToast('Bitcoin address copied!');

// Error notification
showToast('Failed to copy address', { type: 'error' });

// Custom duration
showToast('Copied!', { duration: 5000 });
```

### Utility Functions

```tsx
import { 
  truncateText, 
  isValidAmount,
  formatCurrencyValue 
} from 'bitcoin-ui';

// Truncate long text
const short = truncateText('very long text here', 10, 5);

// Validate currency amounts
const isValid = isValidAmount('123.45', 'USD');

// Format currency values
const formatted = formatCurrencyValue('1234.56', 'US');
```

## 📱 Mobile Considerations

All components are designed mobile-first with:

- Touch-friendly interactive areas (minimum 44px)
- Responsive typography and spacing
- Optimized for small screens
- Proper viewport handling for iOS Safari

## 🔒 Security Best Practices

When handling sensitive Bitcoin data:

1. **Clear sensitive data** - Clear form values when appropriate
2. **Validate inputs** - Use provided validation utilities
3. **Secure clipboard** - Components handle clipboard securely
4. **Screen recording protection** - Consider `user-select: none` for sensitive data

## 🧪 Development

### Setup
```bash
git clone <repository-url>
cd bitcoin-ui
pnpm install
```

### Scripts
```bash
# Start Storybook (component playground)
pnpm storybook

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run accessibility tests
pnpm test:a11y

# Run test coverage
pnpm test:coverage

# Run story tests (verify all Storybook stories render)
pnpm test:stories

# Run story tests in watch mode
pnpm test:stories:watch

# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Build for production
pnpm build

# Development with hot reload
pnpm dev
```

### Viewing Components
The best way to explore and test components is through our live website and storybook:

**🌐 [Visit bitcoinui.org →](https://bitcoinui.org/)**
**📚 [Visit Storybook →](https://bitcoin-ui-kit.github.io/bitcoin-ui)**

For local development with Storybook:

```bash
# Start the interactive component playground
pnpm storybook
```

Then open [http://localhost:6006](http://localhost:6006) to:
- **Test components** with different props and styling
- **View all component variations** and examples
- **Copy implementation code** for your projects
- **Test accessibility** features and keyboard navigation
- **Experiment with styling** approaches for design-flexible components

## ♿ Accessibility

All components follow [Bitcoin Universal Design Accessibility Standards](https://jason-me.github.io/bitcoin-universal-design/) and include:

- **Screen Reader Support** - ARIA labels, descriptions, and live regions
- **Keyboard Navigation** - Full keyboard accessibility with proper focus management
- **High Contrast** - Supports high contrast mode and custom focus indicators
- **Semantic HTML** - Proper HTML structure and roles
- **Clear Feedback** - Accessible announcements for all user actions
- **Responsive Design** - Works across all device sizes and orientations

### Testing Accessibility
```bash
# Run accessibility tests
pnpm test:a11y

# Test with screen readers
# - NVDA (Windows)
# - JAWS (Windows) 
# - VoiceOver (macOS)
# - TalkBack (Android)
```

## 🔧 Testing

The library includes comprehensive tests:

- **55+ Unit Tests** - Component functionality and edge cases
- **32 Story Tests** - Verify all Storybook stories render correctly
- **Accessibility Tests** - Automated a11y testing with jest-axe
- **Type Tests** - TypeScript type checking
- **Integration Tests** - Component interaction testing

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test src/components/secret
pnpm test src/components/password-input
pnpm test src/components/qr-code
pnpm test src/components/expandable-text
pnpm test src/components/currency-input

# Run with coverage
pnpm test:coverage
```

## 🌟 Design Principles

This library follows the [Bitcoin Design Guide](https://bitcoin.design/guide/) principles:

- **Clarity** - Clear, unambiguous interfaces
- **Consistency** - Consistent patterns across components
- **Accessibility** - Inclusive design for all users
- **Security** - Secure handling of sensitive Bitcoin data
- **Simplicity** - Focus on essential functionality
- **Trust** - Building user confidence through good UX

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Component Guidelines
When contributing new components:

1. **Follow Bitcoin Design Guide** principles
2. **Implement full accessibility** with ARIA support
3. **Write comprehensive tests** (unit + a11y)
4. **Use TypeScript** with proper type definitions
5. **Keep components flexible** - minimize styling
6. **Document thoroughly** with examples

## 📄 License

MIT © [Bitcoin UI](LICENSE)

## 🔗 Links

- **🌐 [Live Website & Documentation](https://bitcoinui.org/)** - Interactive examples and complete docs
- **🎮 [Component Playground](https://bitcoinui.org/playground)** - Try components live
- **📚 [Getting Started Guide](https://bitcoinui.org/getting-started)** - Quick start tutorial
- **🧩 [All Components](https://bitcoinui.org/components)** - Complete component library
- [Bitcoin Design Guide](https://bitcoin.design/guide/)
- [Bitcoin Universal Design Accessibility Standards](https://jason-me.github.io/bitcoin-universal-design/)
- [GitHub Repository](https://github.com/bitcoin-ui/bitcoin-ui)
- [Contributing Guidelines](CONTRIBUTING.md)
