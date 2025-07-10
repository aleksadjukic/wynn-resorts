import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { FormField } from './FormField'
import { RegistrationFormData } from '@/lib/validations/registration'

// Mock UI components
jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}))

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
}))

// Test component wrapper that provides form context
const FormFieldWrapper = ({ 
  error, 
  id = 'firstName',
  ...props 
}: any) => {
  const { register } = useForm<RegistrationFormData>()
  
  return (
    <FormField
      id={id}
      label="Test Field"
      placeholder="Enter test value"
      register={register}
      error={error}
      {...props}
    />
  )
}

describe('FormField', () => {
  describe('Rendering', () => {
    it('renders with label and input', () => {
      render(<FormFieldWrapper />)
      
      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      render(<FormFieldWrapper label="Custom Label" />)
      
      expect(screen.getByText('Custom Label')).toBeInTheDocument()
    })

    it('renders with placeholder', () => {
      render(<FormFieldWrapper placeholder="Custom placeholder" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Custom placeholder')
    })

    it('renders with required asterisk when required', () => {
      render(<FormFieldWrapper required />)
      
      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveAttribute('aria-label', 'required')
    })

    it('does not render asterisk when not required', () => {
      render(<FormFieldWrapper required={false} />)
      
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('renders info tooltip button', () => {
      render(<FormFieldWrapper />)
      
      const infoButton = screen.getByRole('button')
      expect(infoButton).toBeInTheDocument()
      expect(infoButton).toHaveAttribute('type', 'button')
    })
  })

  describe('Input Types', () => {
    it('renders with default text type', () => {
      render(<FormFieldWrapper />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('renders with email type when specified', () => {
      render(<FormFieldWrapper type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders with password type when specified', () => {
      render(<FormFieldWrapper type="password" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'password')
    })
  })

  describe('Error States', () => {
    const mockError = {
      type: 'required',
      message: 'This field is required'
    }

    it('displays error message when error is provided', () => {
      render(<FormFieldWrapper error={mockError} />)
      
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('applies error styling to input when error is provided', () => {
      render(<FormFieldWrapper error={mockError} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-[#B3261E]')
      expect(input).toHaveClass('focus:border-[#B3261E]')
      expect(input).toHaveClass('focus:ring-[#B3261E]')
      expect(input).toHaveClass('text-[#B3261E]')
    })

    it('does not show error message when no error', () => {
      render(<FormFieldWrapper />)
      
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
    })

    it('does not apply error styling when no error', () => {
      render(<FormFieldWrapper />)
      
      const input = screen.getByRole('textbox')
      expect(input).not.toHaveClass('border-[#B3261E]')
      expect(input).not.toHaveClass('text-[#B3261E]')
    })

    it('shows error with proper styling color', () => {
      render(<FormFieldWrapper error={mockError} />)
      
      const errorMessage = screen.getByText('This field is required')
      expect(errorMessage).toHaveClass('text-[#B3261E]')
    })
  })

  describe('Accessibility', () => {
    it('associates label with input correctly', () => {
      render(<FormFieldWrapper id="firstName" />)
      
      const input = screen.getByRole('textbox')
      const label = screen.getByText('Test Field')
      
      expect(input).toHaveAttribute('id', 'firstName')
      expect(label).toHaveAttribute('for', 'firstName')
    })

    it('has proper label structure', () => {
      render(<FormFieldWrapper />)
      
      const label = screen.getByText('Test Field')
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveClass('text-sm', 'text-gray-700', 'mb-2', 'block')
    })

    it('provides aria-label for required asterisk', () => {
      render(<FormFieldWrapper required />)
      
      const asterisk = screen.getByLabelText('required')
      expect(asterisk).toBeInTheDocument()
    })

    it('has focus styles', () => {
      render(<FormFieldWrapper />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('w-full', 'h-[60px]', 'bg-white', 'rounded-[4px]')
    })
  })

  describe('Tooltip Functionality', () => {
    it('shows default tooltip content for firstName', () => {
      render(<FormFieldWrapper id="firstName" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Enter your legal first name as it appears on your ID')
    })

    it('shows default tooltip content for lastName', () => {
      render(<FormFieldWrapper id="lastName" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Enter your legal last name as it appears on your ID')
    })

    it('shows default tooltip content for email', () => {
      render(<FormFieldWrapper id="email" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent("We'll use this email for account verification and communications")
    })

    it('shows custom tooltip content when provided', () => {
      render(<FormFieldWrapper tooltipContent="Custom tooltip message" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Custom tooltip message')
    })

    it('shows default fallback tooltip for unknown fields', () => {
      render(<FormFieldWrapper id="unknownField" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Please provide accurate information')
    })

    it('has proper tooltip button styling', () => {
      render(<FormFieldWrapper />)
      
      const tooltipButton = screen.getByRole('button')
      expect(tooltipButton).toHaveClass('w-6', 'h-6', 'text-gray-400', 'hover:text-gray-600', 'mb-2')
    })
  })

  describe('Styling and Layout', () => {
    it('applies default className to input', () => {
      render(<FormFieldWrapper />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('w-full', 'h-[60px]', 'bg-white', 'rounded-[4px]')
    })

    it('applies custom className when provided', () => {
      render(<FormFieldWrapper className="custom-class" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
    })

    it('has proper label and tooltip layout', () => {
      render(<FormFieldWrapper />)
      
      const labelContainer = screen.getByText('Test Field').closest('div')
      expect(labelContainer).toHaveClass('flex', 'items-center', 'justify-between')
    })

    it('positions tooltip button correctly', () => {
      render(<FormFieldWrapper />)
      
      const tooltipButton = screen.getByRole('button')
      expect(tooltipButton).toHaveClass('mb-2')
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form register', async () => {
      const user = userEvent.setup()
      render(<FormFieldWrapper />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'test value')
      
      expect(input).toHaveValue('test value')
    })

    it('handles different field IDs correctly', () => {
      const { rerender } = render(<FormFieldWrapper id="firstName" />)
      
      let input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'firstName')
      
      rerender(<FormFieldWrapper id="lastName" />)
      input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'lastName')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty error object', () => {
      render(<FormFieldWrapper error={undefined} />)
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('handles very long error messages', () => {
      const longError = {
        type: 'validation',
        message: 'This is a very long error message that should still display correctly and not break the layout or functionality of the form field component'
      }
      
      render(<FormFieldWrapper error={longError} />)
      
      expect(screen.getByText(longError.message)).toBeInTheDocument()
    })

    it('handles special characters in placeholder', () => {
      render(<FormFieldWrapper placeholder="Enter value with special chars: !@#$%^&*()" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Enter value with special chars: !@#$%^&*()')
    })

    it('handles empty label gracefully', () => {
      render(<FormFieldWrapper label="" />)
      
      const label = screen.getByRole('textbox').closest('div')?.querySelector('label')
      expect(label).toBeInTheDocument()
    })
  })

  describe('TypeScript Compliance', () => {
    it('accepts all valid RegistrationFormData field IDs', () => {
      const validIds: (keyof RegistrationFormData)[] = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'gender',
        'country',
        'acceptTerms'
      ]

      validIds.forEach(id => {
        expect(() => render(<FormFieldWrapper id={id} />)).not.toThrow()
      })
    })
  })
}) 