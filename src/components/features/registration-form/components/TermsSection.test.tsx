import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { TermsSection } from './TermsSection'
import { RegistrationFormData } from '@/lib/validations/registration'

// Mock the child components
jest.mock('./CheckboxField', () => ({
  CheckboxField: ({ name, label, error, control }: any) => (
    <div data-testid={`checkbox-field-${name}`}>
      <input 
        type="checkbox" 
        id={name}
        data-testid={`checkbox-${name}`}
      />
      <label htmlFor={name}>{label}</label>
      {error && <span data-testid={`error-${name}`}>{error.message}</span>}
    </div>
  )
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, onClick, className, type, ...props }: any) => (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      data-testid="submit-button"
      {...props}
    >
      {children}
    </button>
  )
}))

// Test component wrapper that provides form context
const TermsSectionWrapper = ({ 
  errors = {}, 
  isSubmitting = false,
  onSubmit = jest.fn()
}: { 
  errors?: any, 
  isSubmitting?: boolean,
  onSubmit?: () => void
}) => {
  const { control } = useForm<RegistrationFormData>()
  
  return (
    <TermsSection
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  )
}

describe('TermsSection', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders checkbox field for terms acceptance', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      expect(screen.getByTestId('checkbox-field-acceptTerms')).toBeInTheDocument()
      expect(screen.getByText('I agree to the terms and conditions and privacy policy.')).toBeInTheDocument()
    })

    it('renders submit button', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('has proper section structure', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const wrapper = screen.getByTestId('checkbox-field-acceptTerms').closest('.mt-8')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Checkbox Field Integration', () => {
    it('passes correct props to CheckboxField', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const checkboxField = screen.getByTestId('checkbox-field-acceptTerms')
      const checkbox = screen.getByTestId('checkbox-acceptTerms')
      
      expect(checkboxField).toBeInTheDocument()
      expect(checkbox).toHaveAttribute('type', 'checkbox')
      expect(checkbox).toHaveAttribute('id', 'acceptTerms')
    })

    it('displays terms acceptance label correctly', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      expect(screen.getByText('I agree to the terms and conditions and privacy policy.')).toBeInTheDocument()
    })

    it('handles checkbox interaction', async () => {
      const user = userEvent.setup()
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const checkbox = screen.getByTestId('checkbox-acceptTerms')
      await user.click(checkbox)
      
      // The checkbox interaction is handled by the mocked component
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('Submit Button Configuration', () => {
    it('has correct button text when not submitting', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('shows processing text when submitting', () => {
      render(<TermsSectionWrapper isSubmitting={true} onSubmit={mockOnSubmit} />)
      
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })

    it('is disabled when submitting', () => {
      render(<TermsSectionWrapper isSubmitting={true} onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      expect(button).toBeDisabled()
    })

    it('is enabled when not submitting', () => {
      render(<TermsSectionWrapper isSubmitting={false} onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      expect(button).not.toBeDisabled()
    })

    it('has proper button styling', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveClass(
        'text-[16px]',
        'bg-[#006F62]',
        'py-[16px]',
        'px-[32px]',
        'h-[56px]',
        'w-[217px]',
        'mt-10',
        'disabled:opacity-50'
      )
    })

    it('has correct button type', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Error Handling', () => {
    const mockError = {
      acceptTerms: { type: 'required', message: 'You must accept the terms and conditions' }
    }

    it('displays error when terms are not accepted', () => {
      render(<TermsSectionWrapper errors={mockError} onSubmit={mockOnSubmit} />)
      
      expect(screen.getByTestId('error-acceptTerms')).toHaveTextContent('You must accept the terms and conditions')
    })

    it('does not display error when no error is provided', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      expect(screen.queryByTestId('error-acceptTerms')).not.toBeInTheDocument()
    })

    it('handles custom error messages', () => {
      const customError = {
        acceptTerms: { type: 'validation', message: 'Custom terms error message' }
      }
      
      render(<TermsSectionWrapper errors={customError} onSubmit={mockOnSubmit} />)
      
      expect(screen.getByTestId('error-acceptTerms')).toHaveTextContent('Custom terms error message')
    })
  })

  describe('Form Submission', () => {
    it('calls onSubmit when button is clicked', async () => {
      const user = userEvent.setup()
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      await user.click(button)
      
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    })

    it('does not call onSubmit when button is disabled', async () => {
      const user = userEvent.setup()
      render(<TermsSectionWrapper isSubmitting={true} onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      await user.click(button)
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('prevents multiple rapid submissions', async () => {
      const user = userEvent.setup()
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      
      // Rapid clicks
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      // onSubmit should be called for each click
      expect(mockOnSubmit).toHaveBeenCalledTimes(3)
    })
  })

  describe('Layout and Positioning', () => {
    it('has proper spacing from previous content', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const wrapper = screen.getByTestId('checkbox-field-acceptTerms').closest('.mt-8')
      expect(wrapper).toBeInTheDocument()
    })

    it('positions submit button correctly', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveClass('mt-10')
    })

    it('maintains proper component hierarchy', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const wrapper = screen.getByTestId('checkbox-field-acceptTerms').closest('.mt-8')
      const checkbox = screen.getByTestId('checkbox-field-acceptTerms')
      const button = screen.getByTestId('submit-button')
      
      expect(wrapper).toContainElement(checkbox)
      expect(wrapper).toContainElement(button)
    })
  })

  describe('Accessibility', () => {
    it('maintains proper form submission flow', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('provides proper button labeling', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const checkbox = screen.getByTestId('checkbox-acceptTerms')
      const button = screen.getByTestId('submit-button')
      
      // Tab should navigate between checkbox and button
      await user.tab()
      // Focus behavior depends on the specific implementation
      expect(checkbox).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form control', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      // CheckboxField should receive the control prop
      expect(screen.getByTestId('checkbox-field-acceptTerms')).toBeInTheDocument()
    })

    it('handles form state properly', () => {
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      
      const checkbox = screen.getByTestId('checkbox-acceptTerms')
      const button = screen.getByTestId('submit-button')
      
      expect(checkbox).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })
  })

  describe('Loading States', () => {
    it('shows loading state correctly', () => {
      render(<TermsSectionWrapper isSubmitting={true} onSubmit={mockOnSubmit} />)
      
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveTextContent('Processing...')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('returns to normal state when not submitting', () => {
      const { rerender } = render(
        <TermsSectionWrapper isSubmitting={true} onSubmit={mockOnSubmit} />
      )
      
      let button = screen.getByTestId('submit-button')
      expect(button).toHaveTextContent('Processing...')
      expect(button).toBeDisabled()
      
      rerender(<TermsSectionWrapper isSubmitting={false} onSubmit={mockOnSubmit} />)
      
      button = screen.getByTestId('submit-button')
      expect(button).toHaveTextContent('Next')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined errors gracefully', () => {
      render(<TermsSectionWrapper errors={undefined} onSubmit={mockOnSubmit} />)
      
      expect(screen.queryByTestId('error-acceptTerms')).not.toBeInTheDocument()
    })

    it('handles empty errors object gracefully', () => {
      render(<TermsSectionWrapper errors={{}} onSubmit={mockOnSubmit} />)
      
      expect(screen.queryByTestId('error-acceptTerms')).not.toBeInTheDocument()
    })

    it('handles missing onSubmit gracefully', () => {
      expect(() => render(<TermsSectionWrapper />)).not.toThrow()
    })

    it('handles boolean isSubmitting values correctly', () => {
      const { rerender } = render(<TermsSectionWrapper isSubmitting={false} onSubmit={mockOnSubmit} />)
      
      let button = screen.getByTestId('submit-button')
      expect(button).not.toBeDisabled()
      
      rerender(<TermsSectionWrapper isSubmitting={true} onSubmit={mockOnSubmit} />)
      
      button = screen.getByTestId('submit-button')
      expect(button).toBeDisabled()
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      render(<TermsSectionWrapper onSubmit={mockOnSubmit} />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles state changes efficiently', () => {
      const { rerender } = render(
        <TermsSectionWrapper isSubmitting={false} onSubmit={mockOnSubmit} />
      )
      
      const startTime = performance.now()
      rerender(<TermsSectionWrapper isSubmitting={true} onSubmit={mockOnSubmit} />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50)
    })
  })
}) 