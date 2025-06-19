import { Meta } from '@storybook/blocks';

<Meta title="Bitcoin UI/Introduction" />

# Bitcoin UI Component Library

Modern, accessible React components for Bitcoin applications. Built with TypeScript and designed following the [Bitcoin Design Guide](https://bitcoin.design/guide/) principles.

## ✨ Features

- 🎨 **Beautiful Default Styling** - Inter font with Bitcoin orange accent colors
- ♿ **Fully Accessible** - WCAG 2.1 AA compliant with screen reader support
- 🌍 **Locale-Aware** - Support for US and EU number formatting
- ₿ **Bitcoin-Specific** - Designed specifically for Bitcoin applications
- 📱 **Mobile-First** - Responsive and touch-friendly design
- 🔒 **Security-Focused** - Secure handling of sensitive Bitcoin data
- 🧪 **Thoroughly Tested** - 64+ tests including accessibility tests
- 🎯 **Zero Dependencies** - Minimal external dependencies (only React + qrcode.react)

## 🧩 Components

### 🔐 Secret
Securely display and copy sensitive information like seed phrases and private keys with reveal/hide functionality.

### 🔑 PasswordInput
Accessible password input with reveal/hide toggle, perfect for wallet passwords.

### 💰 CurrencyInput
Locale-aware currency input with real-time formatting for USD, EUR, and BTC.

### 📄 ExpandableText
Display long text like Bitcoin addresses with expand/collapse and copy functionality.

### 📱 QRCode
Generate QR codes for Bitcoin addresses, payment URIs, and Lightning invoices with copy functionality.

## 🎨 Styling

All components include beautiful default styling with:
- **Inter font family** from Google Fonts
- **Bitcoin orange** (#f97316) accent colors
- **Automatic dark mode** support via CSS custom properties
- **Mobile-first responsive** design
- **BEM naming convention** for easy customization

You can customize components using:
- CSS classes (each component exposes specific class names)
- CSS custom properties for theming
- The `className` prop for additional styling

## 🚀 Getting Started

```tsx
import { PasswordInput, QRCode, Secret } from "bitcoin-ui"

function App() {
  return (
    <div>
      <Secret
        secret="abandon ability able about above absent absorb"
        label="Seed Phrase"
      />

      <PasswordInput
        label="Wallet Password"
        placeholder="Enter your password"
      />

      <QRCode
        value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        label="Bitcoin Address QR"
      />
    </div>
  )
}
```

## 📚 Explore the Components

Use the sidebar to explore each component with interactive examples, prop controls, and code snippets. Each story demonstrates different configurations and styling options.

## ♿ Accessibility

All components follow [Bitcoin Universal Design Accessibility Standards](https://jason-me.github.io/bitcoin-universal-design/) and include:

- Screen reader support with proper ARIA labels
- Full keyboard navigation
- High contrast mode support
- Semantic HTML structure
- Clear focus indicators
- Accessible announcements for user actions

---

**💡 Tip:** Use the Controls panel below each story to experiment with different props and see how components behave in various configurations.
