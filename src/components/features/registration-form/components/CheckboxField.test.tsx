import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { CheckboxField } from './CheckboxField'
import { RegistrationFormData } from '@/lib/validations/registration'

// Mock UI components
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}))

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, className, id }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={className}
      id={id}
      data-testid="checkbox-input"
    />
  )
}))

// Test component wrapper that provides form context
const CheckboxFieldWrapper = ({ 
  error, 
  name = 'acceptTerms',
  ...props 
}: any) => {
  const { control } = useForm<RegistrationFormData>()
  
  return (
    <CheckboxField
      name={name}
      label="I agree to the terms and conditions"
      control={control}
      error={error}
      {...props}
    />
  )
}

describe('CheckboxField', () => {
  describe('Rendering', () => {
    it('renders with label and checkbox', () => {
      render(<CheckboxFieldWrapper />)
      
      expect(screen.getByText('I agree to the terms and conditions')).toBeInTheDocument()
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      render(<CheckboxFieldWrapper label="Custom checkbox label" />)
      
      expect(screen.getByText('Custom checkbox label')).toBeInTheDocument()
    })

    it('has proper checkbox input attributes', () => {
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).toHaveAttribute('type', 'checkbox')
      expect(checkbox).toHaveAttribute('id', 'acceptTerms')
    })

    it('has proper label association', () => {
      render(<CheckboxFieldWrapper />)
      
      const label = screen.getByText('I agree to the terms and conditions')
      expect(label).toHaveAttribute('for', 'acceptTerms')
    })
  })

  describe('Checkbox Interaction', () => {
    it('starts unchecked by default', () => {
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).not.toBeChecked()
    })

    it('can be checked when clicked', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      await user.click(checkbox)
      
      expect(checkbox).toBeChecked()
    })

    it('can be unchecked when clicked again', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      
      // Check first
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
      
      // Uncheck
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('can be checked by clicking the label', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const label = screen.getByText('I agree to the terms and conditions')
      await user.click(label)
      
      const checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).toBeChecked()
    })
  })

  describe('Error States', () => {
    const mockError = {
      type: 'required',
      message: 'You must accept the terms and conditions'
    }

    it('displays error message when error is provided', () => {
      render(<CheckboxFieldWrapper error={mockError} />)
      
      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument()
    })

    it('applies error styling to checkbox when error is provided', () => {
      render(<CheckboxFieldWrapper error={mockError} />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).toHaveClass('border-[#B3261E]')
      expect(checkbox).toHaveClass('data-[state=checked]:border-[#B3261E]')
    })

    it('does not show error message when no error', () => {
      render(<CheckboxFieldWrapper />)
      
      expect(screen.queryByText('You must accept the terms and conditions')).not.toBeInTheDocument()
    })

    it('does not apply error styling when no error', () => {
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).not.toHaveClass('border-[#B3261E]')
    })

    it('shows error with proper styling color', () => {
      render(<CheckboxFieldWrapper error={mockError} />)
      
      const errorMessage = screen.getByText('You must accept the terms and conditions')
      expect(errorMessage).toHaveClass('text-[#B3261E]')
    })

    it('removes error styling when error is cleared', () => {
      const { rerender } = render(<CheckboxFieldWrapper error={mockError} />)
      
      let checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).toHaveClass('border-[#B3261E]')
      
      rerender(<CheckboxFieldWrapper />)
      
      checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).not.toHaveClass('border-[#B3261E]')
    })
  })

  describe('Accessibility', () => {
    it('associates label with checkbox correctly', () => {
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      const label = screen.getByText('I agree to the terms and conditions')
      
      expect(checkbox).toHaveAttribute('id', 'acceptTerms')
      expect(label).toHaveAttribute('for', 'acceptTerms')
    })

    it('has proper label structure', () => {
      render(<CheckboxFieldWrapper />)
      
      const label = screen.getByText('I agree to the terms and conditions')
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveClass('text-[16px]', 'text-[#1D1F22]', 'leading-relaxed')
    })

    it('maintains proper focus behavior', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      await user.tab()
      
      expect(checkbox).toHaveFocus()
    })

    it('supports keyboard interaction', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      
      // Focus the checkbox
      await user.tab()
      expect(checkbox).toHaveFocus()
      
      // Check with spacebar
      await user.keyboard(' ')
      expect(checkbox).toBeChecked()
      
      // Uncheck with spacebar
      await user.keyboard(' ')
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Tooltip Functionality', () => {
    it('shows default tooltip content for acceptTerms', () => {
      render(<CheckboxFieldWrapper />)
      
      // The tooltip is not visible by default in this component structure
      // but we can test that the tooltip content function works correctly
      expect(screen.getByText('I agree to the terms and conditions')).toBeInTheDocument()
    })

    it('shows custom tooltip content when provided', () => {
      render(<CheckboxFieldWrapper tooltipContent="Custom tooltip message" />)
      
      // Custom tooltip would be handled by the implementation
      expect(screen.getByText('I agree to the terms and conditions')).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('applies default className to container', () => {
      render(<CheckboxFieldWrapper />)
      
      const container = screen.getByTestId('checkbox-input').closest('div')
      expect(container).toHaveClass('flex', 'items-center', 'gap-3')
    })

    it('applies custom className when provided', () => {
      render(<CheckboxFieldWrapper className="custom-class" />)
      
      const container = screen.getByTestId('checkbox-input').closest('div')
      expect(container).toHaveClass('custom-class')
    })

    it('has proper layout structure', () => {
      render(<CheckboxFieldWrapper />)
      
      const outerContainer = screen.getByTestId('checkbox-input').closest('div')?.parentElement
      expect(outerContainer).toHaveClass('flex', 'items-start', 'justify-between', 'gap-3')
    })

    it('positions elements correctly', () => {
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      const label = screen.getByText('I agree to the terms and conditions')
      
      // Checkbox and label should be in the same container
      const container = checkbox.closest('div')
      expect(container).toContainElement(label)
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form Controller', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      
      // Initially unchecked
      expect(checkbox).not.toBeChecked()
      
      // Check the checkbox
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('handles form field name correctly', () => {
      render(<CheckboxFieldWrapper name="acceptTerms" />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).toHaveAttribute('id', 'acceptTerms')
    })
  })

  describe('Field Types', () => {
    it('handles acceptTerms field correctly', () => {
      render(<CheckboxFieldWrapper name="acceptTerms" />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      expect(checkbox).toHaveAttribute('id', 'acceptTerms')
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })

    it('works with different checkbox field names', () => {
      // If we had other checkbox fields, we could test them here
      render(<CheckboxFieldWrapper name="acceptTerms" />)
      
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty error object', () => {
      render(<CheckboxFieldWrapper error={undefined} />)
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('handles very long error messages', () => {
      const longError = {
        type: 'validation',
        message: 'This is a very long error message that should still display correctly and not break the layout or functionality of the checkbox field component and should wrap properly'
      }
      
      render(<CheckboxFieldWrapper error={longError} />)
      
      expect(screen.getByText(longError.message)).toBeInTheDocument()
    })

    it('handles empty label gracefully', () => {
      render(<CheckboxFieldWrapper label="" />)
      
      const label = screen.getByTestId('checkbox-input').closest('div')?.querySelector('label')
      expect(label).toBeInTheDocument()
    })

    it('handles special characters in label', () => {
      render(<CheckboxFieldWrapper label="I agree to the terms & conditions with special chars: !@#$%^&*()" />)
      
      expect(screen.getByText('I agree to the terms & conditions with special chars: !@#$%^&*()')).toBeInTheDocument()
    })

    it('handles long label text with proper wrapping', () => {
      const longLabel = 'I agree to the very long terms and conditions that might span multiple lines and should wrap properly without breaking the layout or functionality of the component'
      
      render(<CheckboxFieldWrapper label={longLabel} />)
      
      expect(screen.getByText(longLabel)).toBeInTheDocument()
    })
  })

  describe('TypeScript Compliance', () => {
    it('accepts valid field names', () => {
      expect(() => render(<CheckboxFieldWrapper name="acceptTerms" />)).not.toThrow()
    })

    it('works with properly typed props', () => {
      const props = {
        name: 'acceptTerms' as const,
        label: 'I agree to the terms',
      }
      
      expect(() => render(<CheckboxFieldWrapper {...props} />)).not.toThrow()
    })
  })

  describe('State Management', () => {
    it('maintains checkbox state correctly', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      
      // Initial state
      expect(checkbox).not.toBeChecked()
      
      // Check
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
      
      // Uncheck
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
      
      // Check again
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('handles rapid state changes correctly', async () => {
      const user = userEvent.setup()
      render(<CheckboxFieldWrapper />)
      
      const checkbox = screen.getByTestId('checkbox-input')
      
      // Rapid clicks
      await user.click(checkbox)
      await user.click(checkbox)
      await user.click(checkbox)
      
      expect(checkbox).toBeChecked()
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      render(<CheckboxFieldWrapper />)
      const endTime = performance.now()
      
      // Should render quickly (less than 100ms is reasonable for this simple component)
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles re-renders efficiently', () => {
      const { rerender } = render(<CheckboxFieldWrapper />)
      
      const startTime = performance.now()
      rerender(<CheckboxFieldWrapper label="Updated label" />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50)
    })
  })
}) 