import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { SelectField } from './SelectField'
import { RegistrationFormData, genderOptions, countryOptions } from '@/lib/validations/registration'

// Mock UI components
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

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="select-wrapper">
      <input 
        data-testid="select-input" 
        value={value || ''} 
        onChange={(e) => onValueChange?.(e.target.value)}
      />
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <option data-testid="select-item" value={value}>{children}</option>
  ),
  SelectTrigger: ({ children, className, id }: any) => (
    <div data-testid="select-trigger" className={className} id={id}>
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
}))

// Test component wrapper that provides form context
const SelectFieldWrapper = ({ 
  error, 
  name = 'gender',
  options = genderOptions,
  ...props 
}: any) => {
  const { control } = useForm<RegistrationFormData>()
  
  return (
    <SelectField
      name={name}
      label="Test Select"
      placeholder="Select an option"
      options={options}
      control={control}
      error={error}
      {...props}
    />
  )
}

describe('SelectField', () => {
  describe('Rendering', () => {
    it('renders with label and select trigger', () => {
      render(<SelectFieldWrapper />)
      
      expect(screen.getByText('Test Select')).toBeInTheDocument()
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      render(<SelectFieldWrapper label="Custom Label" />)
      
      expect(screen.getByText('Custom Label')).toBeInTheDocument()
    })

    it('renders with placeholder', () => {
      render(<SelectFieldWrapper placeholder="Custom placeholder" />)
      
      expect(screen.getByText('Custom placeholder')).toBeInTheDocument()
    })

    it('renders with required asterisk when required', () => {
      render(<SelectFieldWrapper required />)
      
      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveAttribute('aria-label', 'required')
    })

    it('does not render asterisk when not required', () => {
      render(<SelectFieldWrapper required={false} />)
      
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('renders info tooltip button', () => {
      render(<SelectFieldWrapper />)
      
      const infoButton = screen.getByRole('button')
      expect(infoButton).toBeInTheDocument()
      expect(infoButton).toHaveAttribute('type', 'button')
    })
  })

  describe('Options Rendering', () => {
    it('renders gender options correctly', () => {
      render(<SelectFieldWrapper name="gender" options={genderOptions} />)
      
      const selectItems = screen.getAllByTestId('select-item')
      expect(selectItems).toHaveLength(genderOptions.length)
      
      genderOptions.forEach((option, index) => {
        expect(selectItems[index]).toHaveAttribute('value', option.value)
        expect(selectItems[index]).toHaveTextContent(option.label)
      })
    })

    it('renders country options correctly', () => {
      render(<SelectFieldWrapper name="country" options={countryOptions} />)
      
      const selectItems = screen.getAllByTestId('select-item')
      expect(selectItems).toHaveLength(countryOptions.length)
      
      countryOptions.forEach((option, index) => {
        expect(selectItems[index]).toHaveAttribute('value', option.value)
        expect(selectItems[index]).toHaveTextContent(option.label)
      })
    })

    it('renders custom options correctly', () => {
      const customOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ]
      
      render(<SelectFieldWrapper options={customOptions} />)
      
      const selectItems = screen.getAllByTestId('select-item')
      expect(selectItems).toHaveLength(2)
      expect(selectItems[0]).toHaveTextContent('Option 1')
      expect(selectItems[1]).toHaveTextContent('Option 2')
    })
  })

  describe('Error States', () => {
    const mockError = {
      type: 'required',
      message: 'This field is required'
    }

    it('displays error message when error is provided', () => {
      render(<SelectFieldWrapper error={mockError} />)
      
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('applies error styling to select trigger when error is provided', () => {
      render(<SelectFieldWrapper error={mockError} />)
      
      const selectTrigger = screen.getByTestId('select-trigger')
      expect(selectTrigger).toHaveClass('border-[#B3261E]')
      expect(selectTrigger).toHaveClass('focus:border-[#B3261E]')
      expect(selectTrigger).toHaveClass('focus:ring-[#B3261E]')
      expect(selectTrigger).toHaveClass('text-[#B3261E]')
    })

    it('does not show error message when no error', () => {
      render(<SelectFieldWrapper />)
      
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
    })

    it('does not apply error styling when no error', () => {
      render(<SelectFieldWrapper />)
      
      const selectTrigger = screen.getByTestId('select-trigger')
      expect(selectTrigger).not.toHaveClass('border-[#B3261E]')
      expect(selectTrigger).not.toHaveClass('text-[#B3261E]')
    })

    it('shows error with proper styling color', () => {
      render(<SelectFieldWrapper error={mockError} />)
      
      const errorMessage = screen.getByText('This field is required')
      expect(errorMessage).toHaveClass('text-[#B3261E]')
    })
  })

  describe('Accessibility', () => {
    it('associates label with select correctly', () => {
      render(<SelectFieldWrapper name="gender" />)
      
      const selectTrigger = screen.getByTestId('select-trigger')
      const label = screen.getByText('Test Select')
      
      expect(selectTrigger).toHaveAttribute('id', 'gender')
      expect(label).toHaveAttribute('for', 'gender')
    })

    it('has proper label structure', () => {
      render(<SelectFieldWrapper />)
      
      const label = screen.getByText('Test Select')
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveClass('text-sm', 'text-gray-700', 'mb-2', 'block')
    })

    it('provides aria-label for required asterisk', () => {
      render(<SelectFieldWrapper required />)
      
      const asterisk = screen.getByLabelText('required')
      expect(asterisk).toBeInTheDocument()
    })
  })

  describe('Tooltip Functionality', () => {
    it('shows default tooltip content for gender', () => {
      render(<SelectFieldWrapper name="gender" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Select your gender identity for personalized service')
    })

    it('shows default tooltip content for country', () => {
      render(<SelectFieldWrapper name="country" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Select your country of residence for compliance and service purposes')
    })

    it('shows custom tooltip content when provided', () => {
      render(<SelectFieldWrapper tooltipContent="Custom tooltip message" />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Custom tooltip message')
    })

    it('has proper tooltip button styling', () => {
      render(<SelectFieldWrapper />)
      
      const tooltipButton = screen.getByRole('button')
      expect(tooltipButton).toHaveClass('w-6', 'h-6', 'text-gray-400', 'hover:text-gray-600', 'mb-2')
    })
  })

  describe('Styling and Layout', () => {
    it('applies default className to select trigger', () => {
      render(<SelectFieldWrapper />)
      
      const selectTrigger = screen.getByTestId('select-trigger')
      expect(selectTrigger).toHaveClass('w-full', 'bg-white', 'rounded-[4px]')
    })

    it('applies custom className when provided', () => {
      render(<SelectFieldWrapper className="custom-class" />)
      
      const selectTrigger = screen.getByTestId('select-trigger')
      expect(selectTrigger).toHaveClass('custom-class')
    })

    it('has proper label and tooltip layout', () => {
      render(<SelectFieldWrapper />)
      
      const labelContainer = screen.getByText('Test Select').closest('div')
      expect(labelContainer).toHaveClass('flex', 'items-center', 'justify-between')
    })

    it('positions tooltip button correctly', () => {
      render(<SelectFieldWrapper />)
      
      const tooltipButton = screen.getByRole('button')
      expect(tooltipButton).toHaveClass('mb-2')
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form Controller', async () => {
      const user = userEvent.setup()
      render(<SelectFieldWrapper />)
      
      const selectInput = screen.getByTestId('select-input')
      await user.type(selectInput, 'male')
      
      expect(selectInput).toHaveValue('male')
    })

    it('handles different field names correctly', () => {
      const { rerender } = render(<SelectFieldWrapper name="gender" />)
      
      let selectTrigger = screen.getByTestId('select-trigger')
      expect(selectTrigger).toHaveAttribute('id', 'gender')
      
      rerender(<SelectFieldWrapper name="country" />)
      selectTrigger = screen.getByTestId('select-trigger')
      expect(selectTrigger).toHaveAttribute('id', 'country')
    })
  })

  describe('Field Types', () => {
    it('handles gender field correctly', () => {
      render(<SelectFieldWrapper name="gender" />)
      
      expect(screen.getByTestId('select-trigger')).toHaveAttribute('id', 'gender')
      
      // Check that gender options are rendered
      const maleOption = screen.getByText('Male')
      const femaleOption = screen.getByText('Female')
      const otherOption = screen.getByText('Other')
      
      expect(maleOption).toBeInTheDocument()
      expect(femaleOption).toBeInTheDocument()
      expect(otherOption).toBeInTheDocument()
    })

    it('handles country field correctly', () => {
      render(<SelectFieldWrapper name="country" options={countryOptions} />)
      
      expect(screen.getByTestId('select-trigger')).toHaveAttribute('id', 'country')
      
      // Check that country options are rendered
      const usOption = screen.getByText('United States')
      const aeOption = screen.getByText('United Arab Emirates')
      const ukOption = screen.getByText('United Kingdom')
      
      expect(usOption).toBeInTheDocument()
      expect(aeOption).toBeInTheDocument()
      expect(ukOption).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty error object', () => {
      render(<SelectFieldWrapper error={undefined} />)
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('handles very long error messages', () => {
      const longError = {
        type: 'validation',
        message: 'This is a very long error message that should still display correctly and not break the layout or functionality of the select field component'
      }
      
      render(<SelectFieldWrapper error={longError} />)
      
      expect(screen.getByText(longError.message)).toBeInTheDocument()
    })

    it('handles empty options array', () => {
      render(<SelectFieldWrapper options={[]} />)
      
      const selectItems = screen.queryAllByTestId('select-item')
      expect(selectItems).toHaveLength(0)
    })

    it('handles empty label gracefully', () => {
      // Should not throw any errors when rendering with empty label
      expect(() => {
        render(<SelectFieldWrapper label="" />)
      }).not.toThrow()
      
      const selectTrigger = screen.getByTestId('select-trigger')
      expect(selectTrigger).toBeInTheDocument()
    })

    it('handles special characters in option labels', () => {
      const specialOptions = [
        { value: 'special1', label: 'Option with special chars: !@#$%^&*()' },
        { value: 'special2', label: 'Option with émojis: 🎉🚀' },
      ]
      
      render(<SelectFieldWrapper options={specialOptions} />)
      
      expect(screen.getByText('Option with special chars: !@#$%^&*()')).toBeInTheDocument()
      expect(screen.getByText('Option with émojis: 🎉🚀')).toBeInTheDocument()
    })
  })

  describe('TypeScript Compliance', () => {
    it('accepts valid field names', () => {
      expect(() => render(<SelectFieldWrapper name="gender" />)).not.toThrow()
      expect(() => render(<SelectFieldWrapper name="country" />)).not.toThrow()
    })

    it('works with properly typed options', () => {
      expect(() => render(
        <SelectFieldWrapper 
          name="gender" 
          options={genderOptions} 
        />
      )).not.toThrow()
      
      expect(() => render(
        <SelectFieldWrapper 
          name="country" 
          options={countryOptions} 
        />
      )).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many options', () => {
      const manyOptions = Array.from({ length: 100 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`
      }))
      
      render(<SelectFieldWrapper options={manyOptions} />)
      
      const selectItems = screen.getAllByTestId('select-item')
      expect(selectItems).toHaveLength(100)
    })
  })
}) 