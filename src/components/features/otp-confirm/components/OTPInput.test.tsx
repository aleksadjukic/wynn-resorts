import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OTPInput } from './OTPInput'

describe('OTPInput', () => {
  const defaultProps = {
    value: ['', '', '', ''],
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render 4 input fields', () => {
      render(<OTPInput {...defaultProps} />)
      
      expect(screen.getByTestId('otp-input')).toBeInTheDocument()
      expect(screen.getByTestId('otp-input-0')).toBeInTheDocument()
      expect(screen.getByTestId('otp-input-1')).toBeInTheDocument()
      expect(screen.getByTestId('otp-input-2')).toBeInTheDocument()
      expect(screen.getByTestId('otp-input-3')).toBeInTheDocument()
    })

    it('should render with custom test ID', () => {
      render(<OTPInput {...defaultProps} data-testid="custom-otp" />)
      
      expect(screen.getByTestId('custom-otp')).toBeInTheDocument()
      expect(screen.getByTestId('custom-otp-0')).toBeInTheDocument()
      expect(screen.getByTestId('custom-otp-3')).toBeInTheDocument()
    })

    it('should display provided values', () => {
      render(<OTPInput {...defaultProps} value={['1', '2', '3', '4']} />)
      
      expect(screen.getByTestId('otp-input-0')).toHaveValue('1')
      expect(screen.getByTestId('otp-input-1')).toHaveValue('2')
      expect(screen.getByTestId('otp-input-2')).toHaveValue('3')
      expect(screen.getByTestId('otp-input-3')).toHaveValue('4')
    })

    it('should have correct attributes', () => {
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach((input, index) => {
        expect(input).toHaveAttribute('type', 'text')
        expect(input).toHaveAttribute('inputMode', 'numeric')
        expect(input).toHaveAttribute('pattern', '[0-9]')
        expect(input).toHaveAttribute('maxLength', '1')
        expect(input).toHaveAttribute('aria-label', `Digit ${index + 1}`)
      })
    })

    it('should focus first input on mount', async () => {
      render(<OTPInput {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByTestId('otp-input-0')).toHaveFocus()
      })
    })

    it('should not focus when disabled', () => {
      render(<OTPInput {...defaultProps} disabled />)
      
      expect(screen.getByTestId('otp-input-0')).not.toHaveFocus()
    })
  })

  describe('Input Behavior', () => {
    it('should call onChange when typing a digit', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      await user.type(firstInput, '1')
      
      expect(onChange).toHaveBeenCalledWith(['1', '', '', ''])
    })

    it('should auto-focus next input after entering a digit', async () => {
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      const secondInput = screen.getByTestId('otp-input-1')
      
      await user.type(firstInput, '1')
      
      await waitFor(() => {
        expect(secondInput).toHaveFocus()
      })
    })

    it('should not auto-focus when typing in last input', async () => {
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} value={['1', '2', '3', '']} />)
      
      const lastInput = screen.getByTestId('otp-input-3')
      await user.type(lastInput, '4')
      
      expect(lastInput).toHaveFocus()
    })

    it('should limit input to single digit', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      await user.type(firstInput, '123')
      
      // Should only register first digit
      expect(onChange).toHaveBeenCalledWith(['1', '', '', ''])
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('should handle backspace navigation', async () => {
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} value={['1', '2', '', '']} />)
      
      const secondInput = screen.getByTestId('otp-input-1')
      const firstInput = screen.getByTestId('otp-input-0')
      
      secondInput.focus()
      await user.clear(secondInput)
      await user.keyboard('{Backspace}')
      
      await waitFor(() => {
        expect(firstInput).toHaveFocus()
      })
    })

    it('should not navigate back from first input on backspace', async () => {
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      await user.keyboard('{Backspace}')
      
      expect(firstInput).toHaveFocus()
    })
  })

  describe('Paste Functionality', () => {
    it('should handle paste of 4 digits', () => {
      const onChange = jest.fn()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '1234'
        }
      })
      
      expect(onChange).toHaveBeenCalledWith(['1', '2', '3', '4'])
    })

    it('should handle paste of partial digits', () => {
      const onChange = jest.fn()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '12'
        }
      })
      
      expect(onChange).toHaveBeenCalledWith(['1', '2', '', ''])
    })

    it('should filter non-numeric characters from paste', () => {
      const onChange = jest.fn()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '1a2b3c4d'
        }
      })
      
      expect(onChange).toHaveBeenCalledWith(['1', '2', '3', '4'])
    })

    it('should handle paste with more than 4 characters', () => {
      const onChange = jest.fn()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '123456789'
        }
      })
      
      expect(onChange).toHaveBeenCalledWith(['1', '2', '3', '4'])
    })

    it('should focus appropriate input after paste', async () => {
      render(<OTPInput {...defaultProps} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      const thirdInput = screen.getByTestId('otp-input-2')
      
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '12'
        }
      })
      
      await waitFor(() => {
        expect(thirdInput).toHaveFocus()
      })
    })

    it('should only allow paste on first input', () => {
      const onChange = jest.fn()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const secondInput = screen.getByTestId('otp-input-1')
      fireEvent.paste(secondInput, {
        clipboardData: {
          getData: () => '1234'
        }
      })
      
      // Paste should not work on other inputs
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('should disable all inputs when disabled prop is true', () => {
      render(<OTPInput {...defaultProps} disabled />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toBeDisabled()
      })
    })

    it('should have disabled styling', () => {
      render(<OTPInput {...defaultProps} disabled />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('disabled:bg-gray-100', 'disabled:cursor-not-allowed')
      })
    })

    it('should not call onChange when disabled', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} onChange={onChange} disabled />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      await user.type(firstInput, '1')
      
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('Styling and CSS Classes', () => {
    it('should have correct container classes', () => {
      render(<OTPInput {...defaultProps} />)
      
      const container = screen.getByTestId('otp-input')
      expect(container).toHaveClass('flex', 'justify-center', 'gap-4', 'mb-6')
    })

    it('should have correct input classes', () => {
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass(
          'w-16', 'h-16', 'text-2xl', 'text-center', 'border-2', 'border-gray-300', 
          'rounded-lg', 'focus:border-[#006F62]', 'focus:outline-none'
        )
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<OTPInput {...defaultProps} />)
      
      expect(screen.getByLabelText('Digit 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Digit 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Digit 3')).toBeInTheDocument()
      expect(screen.getByLabelText('Digit 4')).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} />)
      
      // Tab through inputs
      await user.tab()
      expect(screen.getByTestId('otp-input-0')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByTestId('otp-input-1')).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty clipboard data', () => {
      const onChange = jest.fn()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => ''
        }
      })
      
      expect(onChange).toHaveBeenCalledWith(['', '', '', ''])
    })

    it('should handle special characters in paste', () => {
      const onChange = jest.fn()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      fireEvent.paste(firstInput, {
        clipboardData: {
          getData: () => '!@#$%^&*()'
        }
      })
      
      expect(onChange).toHaveBeenCalledWith(['', '', '', ''])
    })

    it('should handle rapid typing', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPInput {...defaultProps} onChange={onChange} />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      
      // Type rapidly
      await user.type(firstInput, '1')
      await user.type(screen.getByTestId('otp-input-1'), '2')
      await user.type(screen.getByTestId('otp-input-2'), '3')
      await user.type(screen.getByTestId('otp-input-3'), '4')
      
      expect(onChange).toHaveBeenCalledTimes(4)
      expect(onChange).toHaveBeenLastCalledWith(['1', '2', '3', '4'])
    })

    it('should handle value prop changes', () => {
      const { rerender } = render(<OTPInput {...defaultProps} value={['1', '', '', '']} />)
      
      expect(screen.getByTestId('otp-input-0')).toHaveValue('1')
      
      rerender(<OTPInput {...defaultProps} value={['1', '2', '3', '4']} />)
      
      expect(screen.getByTestId('otp-input-0')).toHaveValue('1')
      expect(screen.getByTestId('otp-input-1')).toHaveValue('2')
      expect(screen.getByTestId('otp-input-2')).toHaveValue('3')
      expect(screen.getByTestId('otp-input-3')).toHaveValue('4')
    })
  })
}) 