import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PhoneNumberInput from './PhoneNumberInput'
import { countries } from '@/lib/countries'

// Mock CountrySelector component
jest.mock('@/components/features/country-selector/CountrySelector', () => {
  return {
    CountrySelector: ({ selectedCountry, onCountryChange }: any) => (
      <div data-testid="country-selector">
        <span data-testid="selected-country">{selectedCountry.name}</span>
        <button 
          data-testid="change-country"
          onClick={() => onCountryChange(countries.find(c => c.code === 'US'))}
        >
          Change to US
        </button>
      </div>
    )
  }
})

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}))

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}))

describe('PhoneNumberInput', () => {
  const mockOnChange = jest.fn()
  const mockOnCountryChange = jest.fn()

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    onCountryChange: mockOnCountryChange,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with default UAE country', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      expect(screen.getByTestId('selected-country')).toHaveTextContent('United Arab Emirates')
    })

    it('renders with default label "Phone Number"', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      expect(screen.getByText('Phone Number')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      render(<PhoneNumberInput {...defaultProps} label="Mobile Number" />)
      
      expect(screen.getByText('Mobile Number')).toBeInTheDocument()
    })

    it('shows required asterisk when required prop is true', () => {
      render(<PhoneNumberInput {...defaultProps} required />)
      
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('renders info tooltip', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      // Look for the first button (which should be the info button) since it's the only button with a specific class
      const buttons = screen.getAllByRole('button')
      const infoButton = buttons.find(button => button.className.includes('w-6 h-6'))
      expect(infoButton).toBeInTheDocument()
    })

    it('displays country dial code', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      expect(screen.getByText('+971')).toBeInTheDocument()
    })

    it('renders phone input field', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const phoneInput = screen.getByRole('textbox')
      expect(phoneInput).toBeInTheDocument()
      expect(phoneInput).toHaveAttribute('type', 'text')
      expect(phoneInput).toHaveAttribute('maxlength', '20')
    })
  })

  describe('Phone Number Formatting', () => {
    it('formats UAE numbers correctly', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '1234567')
      
      expect(mockOnChange).toHaveBeenLastCalledWith('(123) - 4567')
    })

    it('formats US numbers correctly', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      // Change to US country
      const changeCountryButton = screen.getByTestId('change-country')
      await user.click(changeCountryButton)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '1234567890')
      
      expect(mockOnChange).toHaveBeenLastCalledWith('(123) 456-7890')
    })

    it('handles partial US number formatting', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      // Change to US country
      const changeCountryButton = screen.getByTestId('change-country')
      await user.click(changeCountryButton)
      
      const input = screen.getByRole('textbox')
      
      // Test partial formatting
      await user.type(input, '123')
      expect(mockOnChange).toHaveBeenLastCalledWith('123')
      
      await user.clear(input)
      await user.type(input, '123456')
      expect(mockOnChange).toHaveBeenLastCalledWith('(123) 456')
    })

    it('strips non-numeric characters', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '123abc456def')
      
      expect(mockOnChange).toHaveBeenLastCalledWith('(123) - 456')
    })

    it('handles backspace correctly', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '1234567')
      await user.keyboard('{Backspace}')
      
      expect(mockOnChange).toHaveBeenLastCalledWith('(123) - 456')
    })
  })

  describe('Placeholder Behavior', () => {
    it('shows UAE placeholder by default', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', '( ___ ) - ____')
    })

    it('shows US placeholder when US is selected', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      // Change to US country
      const changeCountryButton = screen.getByTestId('change-country')
      await user.click(changeCountryButton)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', '(XXX) XXX-XXXX')
    })

    it('uses custom placeholder when provided', () => {
      render(<PhoneNumberInput {...defaultProps} placeholder="Enter your phone" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Enter your phone')
    })
  })

  describe('Country Changes', () => {
    it('calls onCountryChange when country is changed', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      const changeCountryButton = screen.getByTestId('change-country')
      await user.click(changeCountryButton)
      
      expect(mockOnCountryChange).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'US' })
      )
    })

    it('clears phone number when country changes', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} value="1234567" />)
      
      const changeCountryButton = screen.getByTestId('change-country')
      await user.click(changeCountryButton)
      
      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('updates dial code display when country changes', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      expect(screen.getByText('+971')).toBeInTheDocument()
      
      const changeCountryButton = screen.getByTestId('change-country')
      await user.click(changeCountryButton)
      
      await waitFor(() => {
        expect(screen.getByText('+1')).toBeInTheDocument()
      })
    })
  })

  describe('Value Control', () => {
    it('updates internal state when external value changes', () => {
      const { rerender } = render(<PhoneNumberInput {...defaultProps} value="" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
      
      rerender(<PhoneNumberInput {...defaultProps} value="123-456-7890" />)
      expect(input).toHaveValue('123-456-7890')
    })

    it('calls onChange when user types', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '1')
      
      expect(mockOnChange).toHaveBeenCalledWith('1')
    })
  })

  describe('Error States', () => {
    it('displays error message when error prop is provided', () => {
      render(<PhoneNumberInput {...defaultProps} error="Phone number is required" />)
      
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
    })

    it('applies error styling to input border', () => {
      render(<PhoneNumberInput {...defaultProps} error="Phone number is required" />)
      
      const container = screen.getByRole('textbox').closest('.flex')
      expect(container).toHaveClass('border-[#B3261E]')
      expect(container).toHaveClass('focus-within:border-[#B3261E]')
      expect(container).toHaveClass('focus-within:ring-[#B3261E]')
    })

    it('applies error color to input text', () => {
      render(<PhoneNumberInput {...defaultProps} error="Phone number is required" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('text-[#B3261E]')
    })

    it('removes error styling when error is cleared', () => {
      const { rerender } = render(
        <PhoneNumberInput {...defaultProps} error="Phone number is required" />
      )
      
      let container = screen.getByRole('textbox').closest('.flex')
      expect(container).toHaveClass('border-[#B3261E]')
      
      rerender(<PhoneNumberInput {...defaultProps} />)
      
      container = screen.getByRole('textbox').closest('.flex')
      expect(container).not.toHaveClass('border-[#B3261E]')
    })
  })

  describe('Accessibility', () => {
    it('has proper label association', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      const label = screen.getByText('Phone Number')
      
      expect(input).toHaveAttribute('id', 'phone')
      expect(label).toHaveAttribute('for', 'phone')
    })

    it('shows required indicator in label', () => {
      render(<PhoneNumberInput {...defaultProps} required />)
      
      const requiredSpan = screen.getByText('*')
      expect(requiredSpan).toBeInTheDocument()
    })

    it('has tooltip with helpful information', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const tooltipContent = screen.getByTestId('tooltip-content')
      expect(tooltipContent).toHaveTextContent('Phone number format will adjust based on selected country')
    })

    it('maintains focus outline on input container', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const container = screen.getByRole('textbox').closest('.flex')
      expect(container).toHaveClass('focus-within:ring-2')
      expect(container).toHaveClass('focus-within:ring-blue-500')
    })
  })

  describe('Styling and Layout', () => {
    it('applies custom className to wrapper', () => {
      render(<PhoneNumberInput {...defaultProps} className="custom-class" />)
      
      const wrapper = screen.getByRole('textbox').closest('.w-full')
      expect(wrapper).toHaveClass('custom-class')
    })

    it('has proper input height', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('h-[60px]')
    })

    it('has proper border radius', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const container = screen.getByRole('textbox').closest('.flex')
      expect(container).toHaveClass('rounded-[4px]')
    })

    it('has overflow hidden on container', () => {
      render(<PhoneNumberInput {...defaultProps} />)
      
      const container = screen.getByRole('textbox').closest('.flex')
      expect(container).toHaveClass('overflow-hidden')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty onChange prop gracefully', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput value="" />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '123')
      
      // Should not throw error
      expect(input).toBeInTheDocument()
    })

    it('handles empty onCountryChange prop gracefully', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput />)
      
      const changeCountryButton = screen.getByTestId('change-country')
      await user.click(changeCountryButton)
      
      // Should not throw error
      expect(screen.getByTestId('selected-country')).toHaveTextContent('United States')
    })

    it('handles very long input gracefully', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      const longInput = '12345678901234567890123456789'
      await user.type(input, longInput)
      
      // Should be limited by maxLength
      expect(input.value.length).toBeLessThanOrEqual(20)
    })

    it('handles special characters gracefully', async () => {
      const user = userEvent.setup()
      render(<PhoneNumberInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '!@#$%^&*()')
      
      // Should filter out non-numeric characters
      expect(mockOnChange).toHaveBeenLastCalledWith('')
    })
  })
}) 