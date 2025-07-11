import { renderHook, act, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useOTPSend } from './useOTPSend'
import { sendOTPEmail, sendOTPPhone } from '@/lib/api/otp'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock OTP API
jest.mock('@/lib/api/otp', () => ({
  sendOTPEmail: jest.fn(),
  sendOTPPhone: jest.fn(),
}))

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockSendOTPEmail = sendOTPEmail as jest.MockedFunction<typeof sendOTPEmail>
const mockSendOTPPhone = sendOTPPhone as jest.MockedFunction<typeof sendOTPPhone>

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

describe('useOTPSend', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any)
    console.error = jest.fn()
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useOTPSend())
      
      expect(result.current.selectedMethod).toBe('')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.message).toBe('')
    })

    it('should load user data from localStorage on mount', () => {
      const registrationData = {
        email: 'test@example.com',
        phone: '+1234567890',
        firstName: 'John'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(registrationData))
      
      const { result } = renderHook(() => useOTPSend())
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('wynn_registration_data')
      // User data is loaded internally but not exposed in the hook's interface
    })

    it('should handle missing email/phone in localStorage data', () => {
      const registrationData = { firstName: 'John' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(registrationData))
      
      const { result } = renderHook(() => useOTPSend())
      
      // Hook should still initialize successfully even with missing data
      expect(result.current.selectedMethod).toBe('')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.message).toBe('')
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      
      const { result } = renderHook(() => useOTPSend())
      
      expect(result.current.selectedMethod).toBe('')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.message).toBe('')
      expect(console.error).toHaveBeenCalledWith('Failed to parse registration data:', expect.any(Error))
    })

    it('should handle null localStorage data', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useOTPSend())
      
      expect(result.current.selectedMethod).toBe('')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.message).toBe('')
    })
  })

  describe('handleMethodChange', () => {
    it('should update selected method', () => {
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('email')
      })
      
      expect(result.current.selectedMethod).toBe('email')
    })

    it('should clear message when method changes', () => {
      const { result } = renderHook(() => useOTPSend())
      
      // Set an initial message by trying to send without selection
      act(() => {
        result.current.handleNext()
      })
      
      expect(result.current.message).toBe('Please select a method first')
      
      // Change method should clear message
      act(() => {
        result.current.handleMethodChange('phone')
      })
      
      expect(result.current.message).toBe('')
      expect(result.current.selectedMethod).toBe('phone')
    })

    it('should handle all method types', () => {
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('email')
      })
      expect(result.current.selectedMethod).toBe('email')
      
      act(() => {
        result.current.handleMethodChange('phone')
      })
      expect(result.current.selectedMethod).toBe('phone')
      
      act(() => {
        result.current.handleMethodChange('')
      })
      expect(result.current.selectedMethod).toBe('')
    })
  })

  describe('handleNext', () => {
    it('should show error when no method is selected', async () => {
      const { result } = renderHook(() => useOTPSend())
      
      await act(async () => {
        await result.current.handleNext()
      })
      
      expect(result.current.message).toBe('Please select a method first')
      expect(result.current.isLoading).toBe(false)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should send email OTP successfully', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ email: 'test@example.com' }))
      mockSendOTPEmail.mockResolvedValue('OTP sent to email')
      
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('email')
      })
      
      await act(async () => {
        await result.current.handleNext()
      })
      
      await waitFor(() => {
        expect(mockSendOTPEmail).toHaveBeenCalledWith('test@example.com')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('otp_method', 'email')
        expect(mockPush).toHaveBeenCalledWith('/otp-confirm')
        expect(result.current.isLoading).toBe(false)
        expect(result.current.message).toBe('')
      })
    })

    it('should send phone OTP successfully', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ phone: '+1234567890' }))
      mockSendOTPPhone.mockResolvedValue('OTP sent to phone')
      
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('phone')
      })
      
      await act(async () => {
        await result.current.handleNext()
      })
      
      await waitFor(() => {
        expect(mockSendOTPPhone).toHaveBeenCalledWith('+1234567890')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('otp_method', 'phone')
        expect(mockPush).toHaveBeenCalledWith('/otp-confirm')
        expect(result.current.isLoading).toBe(false)
        expect(result.current.message).toBe('')
      })
    })

    it('should handle email API error', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ email: 'test@example.com' }))
      mockSendOTPEmail.mockRejectedValue(new Error('API Error'))
      
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('email')
      })
      
      await act(async () => {
        await result.current.handleNext()
      })
      
      await waitFor(() => {
        expect(result.current.message).toBe('Failed to send OTP. Please try again.')
        expect(result.current.isLoading).toBe(false)
        expect(mockPush).not.toHaveBeenCalled()
        expect(console.error).toHaveBeenCalledWith('Failed to send OTP:', expect.any(Error))
      })
    })

    it('should handle phone API error', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ phone: '+1234567890' }))
      mockSendOTPPhone.mockRejectedValue(new Error('Network Error'))
      
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('phone')
      })
      
      await act(async () => {
        await result.current.handleNext()
      })
      
      await waitFor(() => {
        expect(result.current.message).toBe('Failed to send OTP. Please try again.')
        expect(result.current.isLoading).toBe(false)
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('should set loading state during API call', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ email: 'test@example.com' }))
      let resolvePromise: (value: string) => void
      mockSendOTPEmail.mockReturnValue(new Promise<string>(resolve => {
        resolvePromise = resolve
      }))
      
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('email')
      })
      
      act(() => {
        result.current.handleNext()
      })
      
      // Should be loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.message).toBe('')
      
      // Resolve the promise
      await act(async () => {
        resolvePromise!('OTP sent')
      })
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should clear message before sending OTP', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ email: 'test@example.com' }))
      mockSendOTPEmail.mockResolvedValue('OTP sent')
      
      const { result } = renderHook(() => useOTPSend())
      
      // Set initial message
      act(() => {
        result.current.handleNext()
      })
      expect(result.current.message).toBe('Please select a method first')
      
      // Select method and send
      act(() => {
        result.current.handleMethodChange('email')
      })
      
      await act(async () => {
        await result.current.handleNext()
      })
      
      await waitFor(() => {
        expect(result.current.message).toBe('')
      })
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete flow from selection to success', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ 
        email: 'user@example.com',
        phone: '+1234567890'
      }))
      mockSendOTPEmail.mockResolvedValue('Success message')
      
      const { result } = renderHook(() => useOTPSend())
      
      // Initial state
      expect(result.current.selectedMethod).toBe('')
      
      // Select method
      act(() => {
        result.current.handleMethodChange('email')
      })
      expect(result.current.selectedMethod).toBe('email')
      
      // Send OTP
      await act(async () => {
        await result.current.handleNext()
      })
      
      await waitFor(() => {
        expect(mockSendOTPEmail).toHaveBeenCalledWith('user@example.com')
        expect(mockPush).toHaveBeenCalledWith('/otp-confirm')
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle switching between methods', async () => {
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('email')
      })
      expect(result.current.selectedMethod).toBe('email')
      
      act(() => {
        result.current.handleMethodChange('phone')
      })
      expect(result.current.selectedMethod).toBe('phone')
      
      act(() => {
        result.current.handleMethodChange('')
      })
      expect(result.current.selectedMethod).toBe('')
    })

    it('should handle localStorage data without email or phone', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ firstName: 'John' }))
      
      const { result } = renderHook(() => useOTPSend())
      
      act(() => {
        result.current.handleMethodChange('email')
      })
      
      await act(async () => {
        await result.current.handleNext()
      })
      
      await waitFor(() => {
        expect(mockSendOTPEmail).toHaveBeenCalledWith('')
      })
    })
  })
}) 