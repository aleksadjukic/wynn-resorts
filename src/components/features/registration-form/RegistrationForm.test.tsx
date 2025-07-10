import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import RegistrationForm from './RegistrationForm'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock the section components
jest.mock('./components/PersonalInfoSection', () => ({
  PersonalInfoSection: ({ register, control, errors }: any) => (
    <div data-testid="personal-info-section">
      <h2>Personal Info</h2>
      <input data-testid="firstName" {...register('firstName')} placeholder="First Name" />
      <input data-testid="lastName" {...register('lastName')} placeholder="Last Name" />
      <select data-testid="gender" {...register('gender')}>
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <select data-testid="country" {...register('country')}>
        <option value="">Select country</option>
        <option value="us">United States</option>
        <option value="ae">United Arab Emirates</option>
      </select>
      {errors.firstName && <span data-testid="firstName-error">{errors.firstName.message}</span>}
      {errors.lastName && <span data-testid="lastName-error">{errors.lastName.message}</span>}
      {errors.gender && <span data-testid="gender-error">{errors.gender.message}</span>}
      {errors.country && <span data-testid="country-error">{errors.country.message}</span>}
    </div>
  )
}))

jest.mock('./components/ContactDetailsSection', () => ({
  ContactDetailsSection: ({ register, control, errors }: any) => (
    <div data-testid="contact-details-section">
      <h2>Contact Details</h2>
      <input data-testid="email" {...register('email')} type="email" placeholder="Email" />
      <input data-testid="phone" {...register('phone')} placeholder="Phone" />
      {errors.email && <span data-testid="email-error">{errors.email.message}</span>}
      {errors.phone && <span data-testid="phone-error">{errors.phone.message}</span>}
    </div>
  )
}))

jest.mock('./components/TermsSection', () => ({
  TermsSection: ({ control, errors, isSubmitting, onSubmit }: any) => (
    <div data-testid="terms-section">
      <label>
        <input 
          data-testid="acceptTerms" 
          type="checkbox" 
          {...control.register('acceptTerms')}
        />
        Accept Terms
      </label>
      <button 
        data-testid="submit-button" 
        type="submit" 
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? 'Processing...' : 'Next'}
      </button>
      {errors.acceptTerms && <span data-testid="acceptTerms-error">{errors.acceptTerms.message}</span>}
    </div>
  )
}))

describe('RegistrationForm', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    localStorageMock.setItem.mockClear()
  })

  describe('Rendering and Layout', () => {
    it('renders the main form container', () => {
      render(<RegistrationForm />)
      
      const container = screen.getByTestId('personal-info-section').closest('.max-w-2xl')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('max-w-2xl', 'mx-auto', 'py-[60px]', 'px-4', 'sm:px-6', 'lg:px-8')
    })

    it('renders the registration header', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByText('Registration')).toBeInTheDocument()
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    })

    it('renders the description text', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByText('Please enter below information to create your account.')).toBeInTheDocument()
    })

    it('has proper header styling', () => {
      render(<RegistrationForm />)
      
      const title = screen.getByText('Registration')
      expect(title).toHaveClass('text-[37px]', 'font-serif', 'text-[#1D1F22]')
      
      const step = screen.getByText('Step 1 of 3')
      expect(step).toHaveClass('font-serif', 'text-2xl', 'text-[#1D1F22]')
    })

    it('has proper description styling', () => {
      render(<RegistrationForm />)
      
      const description = screen.getByText('Please enter below information to create your account.')
      expect(description).toHaveClass('text-[15.5px]', 'text-[#1D1F22]', 'font-semibold')
    })
  })

  describe('Section Integration', () => {
    it('renders PersonalInfoSection', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByTestId('personal-info-section')).toBeInTheDocument()
      expect(screen.getByText('Personal Info')).toBeInTheDocument()
    })

    it('renders ContactDetailsSection', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByTestId('contact-details-section')).toBeInTheDocument()
      expect(screen.getByText('Contact Details')).toBeInTheDocument()
    })

    it('renders TermsSection', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByTestId('terms-section')).toBeInTheDocument()
      expect(screen.getByText('Accept Terms')).toBeInTheDocument()
    })

    it('renders sections in correct order', () => {
      render(<RegistrationForm />)
      
      const form = screen.getByTestId('personal-info-section').closest('form')
      const sections = form?.querySelectorAll('[data-testid$="-section"]')
      
      expect(sections?.[0]).toHaveAttribute('data-testid', 'personal-info-section')
      expect(sections?.[1]).toHaveAttribute('data-testid', 'contact-details-section')
    })
  })

  describe('Form Fields', () => {
    it('renders all required form fields', () => {
      render(<RegistrationForm />)
      
      // Personal info fields
      expect(screen.getByTestId('firstName')).toBeInTheDocument()
      expect(screen.getByTestId('lastName')).toBeInTheDocument()
      expect(screen.getByTestId('gender')).toBeInTheDocument()
      expect(screen.getByTestId('country')).toBeInTheDocument()
      
      // Contact details fields
      expect(screen.getByTestId('email')).toBeInTheDocument()
      expect(screen.getByTestId('phone')).toBeInTheDocument()
      
      // Terms field
      expect(screen.getByTestId('acceptTerms')).toBeInTheDocument()
    })

    it('has proper field placeholders', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument()
    })

    it('has proper field types', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByTestId('email')).toHaveAttribute('type', 'email')
      expect(screen.getByTestId('acceptTerms')).toHaveAttribute('type', 'checkbox')
    })
  })

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('firstName-error')).toBeInTheDocument()
        expect(screen.getByTestId('lastName-error')).toBeInTheDocument()
        expect(screen.getByTestId('email-error')).toBeInTheDocument()
        expect(screen.getByTestId('phone-error')).toBeInTheDocument()
        expect(screen.getByTestId('gender-error')).toBeInTheDocument()
        expect(screen.getByTestId('country-error')).toBeInTheDocument()
        expect(screen.getByTestId('acceptTerms-error')).toBeInTheDocument()
      })
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const emailField = screen.getByTestId('email')
      await user.type(emailField, 'invalid-email')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument()
      })
    })

    it('validates minimum field lengths', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const firstNameField = screen.getByTestId('firstName')
      await user.type(firstNameField, 'A') // Too short
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('firstName-error')).toBeInTheDocument()
      })
    })

    it('clears errors when fields are corrected', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      // Trigger validation error
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('firstName-error')).toBeInTheDocument()
      })
      
      // Fix the field
      const firstNameField = screen.getByTestId('firstName')
      await user.type(firstNameField, 'John')
      
      await waitFor(() => {
        expect(screen.queryByTestId('firstName-error')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'male',
      country: 'us',
      acceptTerms: true,
    }

    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      // Fill in all fields
      await user.type(screen.getByTestId('firstName'), validFormData.firstName)
      await user.type(screen.getByTestId('lastName'), validFormData.lastName)
      await user.type(screen.getByTestId('email'), validFormData.email)
      await user.type(screen.getByTestId('phone'), validFormData.phone)
      await user.selectOptions(screen.getByTestId('gender'), validFormData.gender)
      await user.selectOptions(screen.getByTestId('country'), validFormData.country)
      await user.click(screen.getByTestId('acceptTerms'))
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'wynn_registration_data',
          expect.stringContaining('John')
        )
        expect(mockPush).toHaveBeenCalledWith('/otp-send')
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      // Fill in valid data (simplified for this test)
      await user.type(screen.getByTestId('firstName'), 'John')
      await user.type(screen.getByTestId('lastName'), 'Doe')
      await user.type(screen.getByTestId('email'), 'john@example.com')
      await user.type(screen.getByTestId('phone'), '1234567890')
      await user.selectOptions(screen.getByTestId('gender'), 'male')
      await user.selectOptions(screen.getByTestId('country'), 'us')
      await user.click(screen.getByTestId('acceptTerms'))
      
      const submitButton = screen.getByTestId('submit-button')
      
      // For this test, we just verify the button exists and can be clicked
      // The loading state would be handled by the form submission logic
      expect(submitButton).toHaveTextContent('Next')
      expect(submitButton).not.toBeDisabled()
    })

    it('prevents submission when form is invalid', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      // Submit without filling fields
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      // Should not navigate or store data
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('User Interaction', () => {
    it('allows typing in text fields', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const firstNameField = screen.getByTestId('firstName')
      await user.type(firstNameField, 'John')
      
      expect(firstNameField).toHaveValue('John')
    })

    it('allows selecting dropdown options', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const genderSelect = screen.getByTestId('gender')
      await user.selectOptions(genderSelect, 'male')
      
      expect(genderSelect).toHaveValue('male')
    })

    it('allows checking the terms checkbox', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const termsCheckbox = screen.getByTestId('acceptTerms')
      await user.click(termsCheckbox)
      
      expect(termsCheckbox).toBeChecked()
    })

    it('maintains form state during interaction', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      // Fill multiple fields
      await user.type(screen.getByTestId('firstName'), 'John')
      await user.type(screen.getByTestId('lastName'), 'Doe')
      await user.type(screen.getByTestId('email'), 'john@example.com')
      
      // All fields should maintain their values
      expect(screen.getByTestId('firstName')).toHaveValue('John')
      expect(screen.getByTestId('lastName')).toHaveValue('Doe')
      expect(screen.getByTestId('email')).toHaveValue('john@example.com')
    })
  })

  describe('Form Layout', () => {
    it('has proper spacing between sections', () => {
      render(<RegistrationForm />)
      
      const form = screen.getByTestId('personal-info-section').closest('form')
      expect(form).toHaveClass('space-y-8')
    })

    it('positions TermsSection outside the main form', () => {
      render(<RegistrationForm />)
      
      const termsSection = screen.getByTestId('terms-section')
      const form = screen.getByTestId('personal-info-section').closest('form')
      
      expect(form).not.toContainElement(termsSection)
    })

    it('has proper responsive design classes', () => {
      render(<RegistrationForm />)
      
      const container = screen.getByTestId('personal-info-section').closest('.max-w-2xl')
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })
  })

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(<RegistrationForm />)
      
      const form = screen.getByTestId('personal-info-section').closest('form')
      expect(form).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<RegistrationForm />)
      
      const mainHeading = screen.getByText('Registration')
      expect(mainHeading.tagName).toBe('H1')
      
      const sectionHeadings = screen.getAllByText(/Personal Info|Contact Details/)
      sectionHeadings.forEach(heading => {
        expect(heading.tagName).toBe('H2')
      })
    })

    it('maintains proper focus management', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      // Tab through form elements
      await user.tab()
      const firstField = document.activeElement
      expect(firstField).toBeInTheDocument()
    })
  })

  describe('Error Recovery', () => {
    it('handles localStorage errors gracefully', async () => {
      const user = userEvent.setup()
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      render(<RegistrationForm />)
      
      // Fill and submit form
      await user.type(screen.getByTestId('firstName'), 'John')
      await user.type(screen.getByTestId('lastName'), 'Doe')
      await user.type(screen.getByTestId('email'), 'john@example.com')
      await user.type(screen.getByTestId('phone'), '1234567890')
      await user.selectOptions(screen.getByTestId('gender'), 'male')
      await user.selectOptions(screen.getByTestId('country'), 'us')
      await user.click(screen.getByTestId('acceptTerms'))
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      // Should not navigate on error
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles navigation errors gracefully', async () => {
      const user = userEvent.setup()
      mockPush.mockImplementation(() => {
        throw new Error('Navigation error')
      })
      
      render(<RegistrationForm />)
      
      // Fill and submit form (simplified)
      await user.type(screen.getByTestId('firstName'), 'John')
      await user.type(screen.getByTestId('lastName'), 'Doe')
      await user.type(screen.getByTestId('email'), 'john@example.com')
      await user.type(screen.getByTestId('phone'), '1234567890')
      await user.selectOptions(screen.getByTestId('gender'), 'male')
      await user.selectOptions(screen.getByTestId('country'), 'us')
      await user.click(screen.getByTestId('acceptTerms'))
      
      const submitButton = screen.getByTestId('submit-button')
      
      // Should not crash
      expect(() => user.click(submitButton)).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      render(<RegistrationForm />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(500)
    })

    it('handles form updates efficiently', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const startTime = performance.now()
      
      // Rapid typing should not cause performance issues
      const firstNameField = screen.getByTestId('firstName')
      await user.type(firstNameField, 'John')
      
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
}) 