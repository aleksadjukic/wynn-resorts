import { renderHook, act, waitFor } from '@testing-library/react'
import { useOTPConfirm } from './useOTPConfirm'
import { verifyOTP, resendOTP } from '@/lib/api/otp'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Mock the dependencies
jest.mock('@/lib/api/otp')
jest.mock('next/navigation')
jest.mock('sonner')

const mockVerifyOTP = verifyOTP as jest.MockedFunction<typeof verifyOTP>
const mockResendOTP = resendOTP as jest.MockedFunction<typeof resendOTP>
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
}
const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

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

// Mock console methods
const consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
}

describe('useOTPConfirm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any)
    ;(toast as any).success = mockToast.success
    ;(toast as any).error = mockToast.error
  })

  afterAll(() => {
    consoleSpy.log.mockRestore()
    consoleSpy.error.mockRestore()
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useOTPConfirm())

      expect(result.current.otp).toEqual(['', '', '', ''])
      expect(result.current.isResending).toBe(false)
      expect(result.current.isVerifying).toBe(false)
      expect(result.current.otpMethod).toBe('email')
      expect(result.current.isCodeComplete).toBe(false)
    })

    it('should load OTP method from localStorage', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'otp_method') return 'phone'
        return null
      })

      const { result } = renderHook(() => useOTPConfirm())

      expect(result.current.otpMethod).toBe('phone')
    })
  })

  describe('OTP Handling', () => {
    it('should update OTP when handleOTPChange is called', () => {
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      expect(result.current.otp).toEqual(['1', '2', '3', '4'])
      expect(result.current.isCodeComplete).toBe(true)
    })

    it('should detect incomplete code', () => {
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '', ''])
      })

      expect(result.current.otp).toEqual(['1', '2', '', ''])
      expect(result.current.isCodeComplete).toBe(false)
    })

    it('should handle empty OTP', () => {
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['', '', '', ''])
      })

      expect(result.current.otp).toEqual(['', '', '', ''])
      expect(result.current.isCodeComplete).toBe(false)
    })
  })

  describe('Resend Functionality', () => {
    it('should handle successful resend', async () => {
      mockResendOTP.mockResolvedValue('New OTP sent successfully')
      
      const { result } = renderHook(() => useOTPConfirm())

      // Set initial OTP
      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      await act(async () => {
        await result.current.handleResendCode()
      })

      expect(mockResendOTP).toHaveBeenCalledWith('email')
      expect(result.current.isResending).toBe(false)
      expect(mockToast.success).toHaveBeenCalledWith('New OTP sent successfully', {
        duration: 4000,
        description: 'New verification code sent to your email',
      })
      expect(result.current.otp).toEqual(['', '', '', '']) // Should clear OTP
    })

    it('should handle resend with phone method', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'otp_method') return 'phone'
        return null
      })
      mockResendOTP.mockResolvedValue('OTP resent to phone')
      
      const { result } = renderHook(() => useOTPConfirm())

      await act(async () => {
        await result.current.handleResendCode()
      })

      expect(mockResendOTP).toHaveBeenCalledWith('phone')
      expect(mockToast.success).toHaveBeenCalledWith('OTP resent to phone', {
        duration: 4000,
        description: 'New verification code sent to your phone',
      })
    })

    it('should handle resend failure', async () => {
      mockResendOTP.mockRejectedValue(new Error('Resend failed'))
      
      const { result } = renderHook(() => useOTPConfirm())

      await act(async () => {
        await result.current.handleResendCode()
      })

      expect(mockResendOTP).toHaveBeenCalledWith('email')
      expect(result.current.isResending).toBe(false)
      expect(consoleSpy.error).toHaveBeenCalledWith('Failed to resend code:', expect.any(Error))
    })

    it('should manage loading state during resend', async () => {
      let resolveFn: (value: string) => void
      const promise = new Promise<string>((resolve) => {
        resolveFn = resolve
      })
      mockResendOTP.mockReturnValue(promise)
      
      const { result } = renderHook(() => useOTPConfirm())

      // Start resend
      act(() => {
        result.current.handleResendCode()
      })

      expect(result.current.isResending).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolveFn!('Resent successfully')
        await promise
      })

      expect(result.current.isResending).toBe(false)
    })
  })

  describe('Submit Functionality', () => {
    it('should handle successful registration', async () => {
      mockVerifyOTP.mockResolvedValue('Registration completed successfully')
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'wynn_registration_data') return JSON.stringify({ firstName: 'John', lastName: 'Doe' })
        if (key === 'otp_method') return 'email'
        return null
      })
      
      const { result } = renderHook(() => useOTPConfirm())

      // Set complete OTP
      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() } as any)
      })

      expect(mockVerifyOTP).toHaveBeenCalledWith('1234', 'email', { firstName: 'John', lastName: 'Doe' })
      expect(mockToast.success).toHaveBeenCalledWith('Registration completed successfully', {
        duration: 4000,
        description: 'Welcome to Wynn Resorts!',
      })
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('otp_method')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('wynn_registration_data')
      expect(result.current.otp).toEqual(['', '', '', '']) // Should clear OTP after success
      expect(consoleSpy.log).toHaveBeenCalledWith('Registration completed successfully')
      expect(mockPush).not.toHaveBeenCalled() // Should not navigate away
    })

    it('should handle registration with phone method', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'otp_method') return 'phone'
        return null
      })
      mockVerifyOTP.mockResolvedValue('Registration successful')
      
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() } as any)
      })

      expect(mockVerifyOTP).toHaveBeenCalledWith('1234', 'phone', {})
    })

    it('should not submit with incomplete OTP', async () => {
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '', ''])
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() } as any)
      })

      expect(mockVerifyOTP).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle registration failure', async () => {
      mockVerifyOTP.mockRejectedValue(new Error('Invalid OTP'))
      
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() } as any)
      })

      expect(mockVerifyOTP).toHaveBeenCalledWith('1234', 'email', {})
      expect(mockToast.error).toHaveBeenCalledWith('Registration failed. Please try again.')
      expect(result.current.isVerifying).toBe(false)
      expect(result.current.otp).toEqual(['', '', '', '']) // Should clear OTP on failure
      expect(consoleSpy.error).toHaveBeenCalledWith('Failed to complete registration:', expect.any(Error))
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should manage loading state during verification', async () => {
      let resolveFn: (value: string) => void
      const promise = new Promise<string>((resolve) => {
        resolveFn = resolve
      })
      mockVerifyOTP.mockReturnValue(promise)
      
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      // Start verification
      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() } as any)
      })

      expect(result.current.isVerifying).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolveFn!('Verified')
        await promise
      })

      expect(result.current.isVerifying).toBe(false)
    })

    it('should prevent default form submission', async () => {
      const preventDefault = jest.fn()
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault } as any)
      })

      expect(preventDefault).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle localStorage returning null', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useOTPConfirm())

      expect(result.current.otpMethod).toBe('email')
    })

    it('should handle rapid state changes', async () => {
      mockResendOTP.mockResolvedValue('Resent')
      
      const { result } = renderHook(() => useOTPConfirm())

      // Rapid calls
      await act(async () => {
        result.current.handleOTPChange(['1', '', '', ''])
        result.current.handleOTPChange(['1', '2', '', ''])
        result.current.handleOTPChange(['1', '2', '3', ''])
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      expect(result.current.otp).toEqual(['1', '2', '3', '4'])
      expect(result.current.isCodeComplete).toBe(true)
    })

    it('should handle concurrent resend and verify operations', async () => {
      mockResendOTP.mockResolvedValue('Resent')
      mockVerifyOTP.mockResolvedValue('Verified')
      
      const { result } = renderHook(() => useOTPConfirm())

      act(() => {
        result.current.handleOTPChange(['1', '2', '3', '4'])
      })

      // Start both operations
      await act(async () => {
        const resendPromise = result.current.handleResendCode()
        const submitPromise = result.current.handleSubmit({ preventDefault: jest.fn() } as any)
        
        await Promise.all([resendPromise, submitPromise])
      })

      expect(mockResendOTP).toHaveBeenCalled()
      expect(mockVerifyOTP).toHaveBeenCalled()
    })

    it('should handle invalid localStorage data', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'otp_method') return 'invalid_method'
        return null
      })
      
      const { result } = renderHook(() => useOTPConfirm())

      // Should default to email for invalid method
      expect(result.current.otpMethod).toBe('invalid_method' as any)
    })
  })

  describe('Code Completion Logic', () => {
    it('should correctly identify complete codes', () => {
      const { result } = renderHook(() => useOTPConfirm())

      const testCases = [
        { otp: ['1', '2', '3', '4'], expected: true },
        { otp: ['0', '0', '0', '0'], expected: true },
        { otp: ['1', '2', '3', ''], expected: false },
        { otp: ['', '', '', ''], expected: false },
        { otp: ['1', '', '', '4'], expected: false },
      ]

      testCases.forEach(({ otp, expected }) => {
        act(() => {
          result.current.handleOTPChange(otp)
        })
        expect(result.current.isCodeComplete).toBe(expected)
      })
    })
  })
}) 