# Wynn Resorts Registration System

A modern, responsive user registration system built with Next.js 15, featuring OTP verification, country selection, and comprehensive form validation.

## 🚀 Tech Stack

### Frontend
- **Next.js 15.3.5** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant form handling
- **Zod** - Runtime type validation
- **Sonner** - Beautiful toast notifications
- **Lucide React** - Icon library

### Testing
- **Jest 30** - Testing framework
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Custom Jest matchers
- **User Event** - User interaction simulation

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Docker** - Containerization support

## ✨ Features

### Registration System
- ✅ **Multi-step Registration** - Personal info, contact details, and preferences
- ✅ **Country Selection** - 240+ countries with flags and phone codes
- ✅ **Phone Number Validation** - International format validation
- ✅ **Email Validation** - RFC-compliant email validation
- ✅ **Form Persistence** - Data saved in localStorage between steps

### OTP Verification
- ✅ **Dual Method Support** - Email and SMS OTP options
- ✅ **4-Digit OTP Input** - Accessible input with auto-focus
- ✅ **Paste Support** - Smart paste handling for OTP codes
- ✅ **Resend Functionality** - Rate-limited OTP resending
- ✅ **Real-time Validation** - Instant feedback on input

### User Experience
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Accessibility** - WCAG compliance with proper ARIA labels
- ✅ **Dark Mode Ready** - Theme system integration
- ✅ **Loading States** - Smooth UX with loading indicators
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Toast Notifications** - Non-intrusive feedback system

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── otp-send/          # OTP sending page
│   └── otp-confirm/       # OTP confirmation page
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── registration-form/    # Multi-step registration
│   │   ├── otp-send/            # OTP method selection
│   │   ├── otp-confirm/         # OTP verification
│   │   ├── phone-input/         # International phone input
│   │   ├── country-selector/    # Country selection
│   │   └── newsletter/          # Newsletter signup
│   ├── layout/            # Layout components
│   │   ├── Header/        # Site header
│   │   └── Footer/        # Site footer
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api/               # API integration
│   ├── validations/       # Zod schemas
│   ├── utils.ts           # Utility functions
│   └── countries.ts       # Country data
└── __tests__/            # Test files (co-located)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wynn-resorts
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🧪 Testing

### Test Structure
Our test suite ensures reliability and maintainability:

- **Unit Tests** - Individual component and function testing
- **Integration Tests** - Component interaction testing
- **Accessibility Tests** - ARIA and keyboard navigation
- **User Interaction Tests** - Simulated user workflows

### Test Categories

#### Component Tests
```bash
# Run specific component tests
npm test PhoneNumberInput.test.tsx
npm test RegistrationForm.test.tsx
npm test OTPInput.test.tsx
```

#### Feature Tests
```bash
# Test complete features
npm test otp-send/
npm test otp-confirm/
npm test registration-form/
```

#### API Tests
```bash
# Test API integration
npm test otp.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test pattern
npm test -- --testNamePattern="OTP"
```

### Test Coverage
Our comprehensive test suite maintains high coverage:
- **Components**: 95%+ coverage
- **Hooks**: 100% coverage
- **API Functions**: 100% coverage
- **Utils**: 95%+ coverage

## 🚢 Deployment

### Docker Deployment (Recommended)

1. **Build Docker image**
   ```bash
   docker build -t wynn-resorts .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 wynn-resorts
   ```

3. **Access application**
   Open [http://localhost:3000](http://localhost:3000)

### Docker Compose (Development)
```yaml
version: '3.8'
services:
  wynn-resorts:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Manual Production Build

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔗 API Integration

### OTP Endpoints
The system integrates with mock API endpoints:

```typescript
// Send OTP via Email
POST https://demo4687464.mockable.io/send-otp-email
Body: { email: string }

// Send OTP via Phone
POST http://demo4687464.mockable.io/send-otp-phone
Body: { phone: string }

// Complete Registration
POST http://demo4687464.mockable.io/register
Body: { 
  code: string, 
  method: "email" | "phone",
  ...registrationData 
}

// Resend OTP
POST https://demo4687464.mockable.io/resend-otp
Body: { method: "email" | "phone" }
```

### Registration Flow

1. **User Registration** → Form data saved to localStorage
2. **OTP Method Selection** → User chooses email or SMS
3. **OTP Sending** → API call to send verification code
4. **OTP Verification** → Code verification + registration completion
5. **Success Notification** → Toast confirmation (no page redirect)

## 🎨 Styling & Theming

### Tailwind Configuration
- **Custom Colors** - Wynn brand colors (#006F62, #B3261E)
- **Responsive Breakpoints** - Mobile-first design
- **Custom Components** - Button variants, form inputs
- **Dark Mode Support** - Theme-aware components

### Color Palette
```css
--primary: #006F62      /* Wynn Green */
--primary-hover: #005951
--error: #B3261E        /* Error Red */
--success: #22C55E      /* Success Green */
--warning: #F59E0B      /* Warning Orange */
```

## 🤝 Contributing

### Development Guidelines

1. **Code Style** - Follow ESLint configuration
2. **Type Safety** - Use TypeScript strictly
3. **Testing** - Write tests for new features
4. **Accessibility** - Ensure WCAG compliance
5. **Performance** - Optimize for Core Web Vitals

### Pull Request Process

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Quality

- **ESLint** - Enforced coding standards
- **TypeScript** - Strict type checking
- **Prettier** - Code formatting (if configured)
- **Jest** - Comprehensive test coverage

## 📝 License

This project is private and proprietary to Wynn Resorts.

## 🆘 Support

For technical support or questions:
- Review test files for usage examples
- Check component documentation in JSDoc comments
- Refer to Next.js documentation for framework questions

---

**Built with ❤️ for Wynn Resorts**
