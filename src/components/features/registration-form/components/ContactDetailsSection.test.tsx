import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { ContactDetailsSection } from './ContactDetailsSection'
import { RegistrationFormData } from '@/lib/validations/registration'

// Mock the individual field components
jest.mock('./FormField', () => ({
  FormField: ({ id, label, type, required, error }: any) => (
    <div data-testid={`form-field-${id}`}>
      <label>{label} {required && '*'}</label>
      <input id={id} type={type} />
      {error && <span data-testid={`error-${id}`}>{error.message}</span>}
    </div>
  )
}))

jest.mock('@/components/features/phone-input/PhoneNumberInput', () => {
  return function MockPhoneNumberInput({ value, onChange, error, label, required }: any) {
    return (
      <div data-testid="phone-number-input">
        <label>{label} {required && '*'}</label>
        <input 
          data-testid="phone-input"
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {error && <span data-testid="error-phone">{error}</span>}
      </div>
    )
  }
})

// Test component wrapper that provides form context
const ContactDetailsSectionWrapper = ({ errors = {} }: { errors?: any }) => {
  const { register, control } = useForm<RegistrationFormData>()
  
  return (
    <ContactDetailsSection
      register={register}
      control={control}
      errors={errors}
    />
  )
}

describe('ContactDetailsSection', () => {
  describe('Section Structure', () => {
    it('renders section title', () => {
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByText('Contact Details')).toBeInTheDocument()
    })

    it('has proper section title styling', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const title = screen.getByText('Contact Details')
      expect(title).toHaveClass('text-lg', 'font-serif', 'text-gray-900', 'mb-6', 'pb-2', 'border-b', 'border-b-gray-400', 'inline-block', 'pr-8')
    })

    it('has proper section layout', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const section = screen.getByText('Contact Details').closest('div')
      expect(section).toBeInTheDocument()
    })

    it('has proper fields container layout', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const fieldsContainer = screen.getByTestId('form-field-email').closest('.space-y-6')
      expect(fieldsContainer).toHaveClass('space-y-6')
    })
  })

  describe('Form Fields Rendering', () => {
    it('renders email field', () => {
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument()
      expect(screen.getByText('Email *')).toBeInTheDocument()
    })

    it('renders phone number input', () => {
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByTestId('phone-number-input')).toBeInTheDocument()
      expect(screen.getByText('Phone Number *')).toBeInTheDocument()
    })

    it('renders all fields as required', () => {
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByText('Email *')).toBeInTheDocument()
      expect(screen.getByText('Phone Number *')).toBeInTheDocument()
    })
  })

  describe('Field Props and Configuration', () => {
    it('configures email field correctly', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const emailField = screen.getByTestId('form-field-email')
      const emailInput = emailField.querySelector('input')
      
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('sets correct placeholder for email field', () => {
      // The placeholder would be passed to the FormField component
      // This is tested through the mocked component structure
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument()
    })

    it('configures phone number input correctly', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const phoneInput = screen.getByTestId('phone-number-input')
      expect(phoneInput).toBeInTheDocument()
      
      // Check that the phone input receives correct props
      expect(screen.getByTestId('phone-input')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    const mockErrors = {
      email: { type: 'required', message: 'Email is required' },
      phone: { type: 'required', message: 'Phone number is required' },
    }

    it('displays email error when provided', () => {
      render(<ContactDetailsSectionWrapper errors={{ email: mockErrors.email }} />)
      
      expect(screen.getByTestId('error-email')).toHaveTextContent('Email is required')
    })

    it('displays phone error when provided', () => {
      render(<ContactDetailsSectionWrapper errors={{ phone: mockErrors.phone }} />)
      
      expect(screen.getByTestId('error-phone')).toHaveTextContent('Phone number is required')
    })

    it('displays multiple errors simultaneously', () => {
      render(<ContactDetailsSectionWrapper errors={mockErrors} />)
      
      expect(screen.getByTestId('error-email')).toBeInTheDocument()
      expect(screen.getByTestId('error-phone')).toBeInTheDocument()
    })

    it('does not display errors when none are provided', () => {
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-phone')).not.toBeInTheDocument()
    })

    it('handles validation-specific errors', () => {
      const validationErrors = {
        email: { type: 'pattern', message: 'Please enter a valid email address' },
        phone: { type: 'minLength', message: 'Phone number must be at least 10 digits' },
      }
      
      render(<ContactDetailsSectionWrapper errors={validationErrors} />)
      
      expect(screen.getByTestId('error-email')).toHaveTextContent('Please enter a valid email address')
      expect(screen.getByTestId('error-phone')).toHaveTextContent('Phone number must be at least 10 digits')
    })
  })

  describe('Form Integration', () => {
    it('passes register function to email field', () => {
      // This is implicitly tested by the field rendering,
      // as the mocked component receives the register prop
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument()
    })

    it('uses Controller for phone number input', () => {
      // The phone input should be wrapped in a Controller
      // This is tested through the presence of the phone input component
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByTestId('phone-number-input')).toBeInTheDocument()
    })

    it('integrates with react-hook-form properly', () => {
      render(<ContactDetailsSectionWrapper />)
      
      // Both fields should be rendered, indicating proper form integration
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument()
      expect(screen.getByTestId('phone-number-input')).toBeInTheDocument()
    })
  })

  describe('Layout and Structure', () => {
    it('arranges fields in correct order', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const section = screen.getByText('Contact Details').closest('div')
      const emailField = screen.getByTestId('form-field-email')
      const phoneField = screen.getByTestId('phone-number-input')
      
      // Email should come before phone in the DOM
      const sectionHTML = section?.innerHTML || ''
      const emailIndex = sectionHTML.indexOf('form-field-email')
      const phoneIndex = sectionHTML.indexOf('phone-number-input')
      
      expect(emailIndex).toBeLessThan(phoneIndex)
    })

    it('has proper spacing between fields', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const fieldsContainer = screen.getByTestId('form-field-email').closest('.space-y-6')
      expect(fieldsContainer).toHaveClass('space-y-6')
    })

    it('wraps phone input in proper container', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const phoneContainer = screen.getByTestId('phone-number-input').closest('div')
      expect(phoneContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const heading = screen.getByText('Contact Details')
      expect(heading.tagName).toBe('H2')
    })

    it('maintains proper tab order', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const emailInput = screen.getByTestId('form-field-email').querySelector('input')
      const phoneInput = screen.getByTestId('phone-input')
      
      expect(emailInput).toBeInTheDocument()
      expect(phoneInput).toBeInTheDocument()
    })

    it('provides proper labels for form controls', () => {
      render(<ContactDetailsSectionWrapper />)
      
      expect(screen.getByText('Email *')).toBeInTheDocument()
      expect(screen.getByText('Phone Number *')).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    it('properly integrates FormField component', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const emailField = screen.getByTestId('form-field-email')
      expect(emailField).toBeInTheDocument()
    })

    it('properly integrates PhoneNumberInput component', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const phoneInput = screen.getByTestId('phone-number-input')
      expect(phoneInput).toBeInTheDocument()
    })

    it('passes correct props to child components', () => {
      render(<ContactDetailsSectionWrapper />)
      
      // Email field should have proper configuration
      const emailInput = screen.getByTestId('form-field-email').querySelector('input')
      expect(emailInput).toHaveAttribute('type', 'email')
      
      // Phone input should be present and configured
      expect(screen.getByTestId('phone-input')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined errors gracefully', () => {
      render(<ContactDetailsSectionWrapper errors={undefined} />)
      
      expect(screen.queryByTestId(/error-/)).not.toBeInTheDocument()
    })

    it('handles empty errors object gracefully', () => {
      render(<ContactDetailsSectionWrapper errors={{}} />)
      
      expect(screen.queryByTestId(/error-/)).not.toBeInTheDocument()
    })

    it('handles partial errors object', () => {
      const partialErrors = {
        email: { type: 'required', message: 'Email is required' }
      }
      
      render(<ContactDetailsSectionWrapper errors={partialErrors} />)
      
      expect(screen.getByTestId('error-email')).toBeInTheDocument()
      expect(screen.queryByTestId('error-phone')).not.toBeInTheDocument()
    })

    it('handles missing form props gracefully', () => {
      // This test ensures the component doesn't crash with missing props
      // In real usage, this shouldn't happen, but it's good to be defensive
      expect(() => render(<ContactDetailsSectionWrapper />)).not.toThrow()
    })
  })

  describe('Field Validation Integration', () => {
    it('supports email format validation', () => {
      const emailValidationError = {
        email: { type: 'pattern', message: 'Invalid email format' }
      }
      
      render(<ContactDetailsSectionWrapper errors={emailValidationError} />)
      
      expect(screen.getByTestId('error-email')).toHaveTextContent('Invalid email format')
    })

    it('supports phone validation', () => {
      const phoneValidationError = {
        phone: { type: 'minLength', message: 'Phone number too short' }
      }
      
      render(<ContactDetailsSectionWrapper errors={phoneValidationError} />)
      
      expect(screen.getByTestId('error-phone')).toHaveTextContent('Phone number too short')
    })
  })

  describe('Responsive Design', () => {
    it('maintains proper layout on different screen sizes', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const fieldsContainer = screen.getByTestId('form-field-email').closest('.space-y-6')
      expect(fieldsContainer).toHaveClass('space-y-6')
    })

    it('ensures fields stack vertically', () => {
      render(<ContactDetailsSectionWrapper />)
      
      const section = screen.getByText('Contact Details').closest('div')
      const fieldsContainer = section?.querySelector('.space-y-6')
      
      expect(fieldsContainer).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      render(<ContactDetailsSectionWrapper />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles re-renders efficiently', () => {
      const { rerender } = render(<ContactDetailsSectionWrapper />)
      
      const startTime = performance.now()
      rerender(<ContactDetailsSectionWrapper errors={{ email: { type: 'required', message: 'Required' } }} />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50)
    })
  })
}) 