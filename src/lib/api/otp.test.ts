import { sendOTPEmail, sendOTPPhone, verifyOTP, resendOTP } from './otp'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('OTP API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn() // Mock console.log
  })

  describe('sendOTPEmail', () => {
    it('should send OTP email successfully with custom message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'Custom email OTP sent', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await sendOTPEmail('test@example.com')

      expect(fetch).toHaveBeenCalledWith(
        'https://demo4687464.mockable.io/send-otp-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com' }),
        }
      )
      expect(result).toBe('Custom email OTP sent')
      expect(console.log).toHaveBeenCalledWith('Email OTP response:', { msg: 'Custom email OTP sent', success: true })
    })

    it('should return default message when API response has no message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await sendOTPEmail('test@example.com')

      expect(result).toBe('OTP sent successfully to your email')
    })

    it('should throw error when API response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 400
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await expect(sendOTPEmail('test@example.com')).rejects.toThrow('HTTP error! status: 400')
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(sendOTPEmail('test@example.com')).rejects.toThrow('Network error')
    })

    it('should handle empty email parameter', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'OTP sent', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await sendOTPEmail('')

      expect(fetch).toHaveBeenCalledWith(
        'https://demo4687464.mockable.io/send-otp-email',
        expect.objectContaining({
          body: JSON.stringify({ email: '' }),
        })
      )
    })
  })

  describe('sendOTPPhone', () => {
    it('should send OTP phone successfully with custom message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'Custom phone OTP sent', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await sendOTPPhone('+1234567890')

      expect(fetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/send-otp-phone',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: '+1234567890' }),
        }
      )
      expect(result).toBe('Custom phone OTP sent')
      expect(console.log).toHaveBeenCalledWith('Phone OTP response:', { msg: 'Custom phone OTP sent', success: true })
    })

    it('should return default message when API response has no message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await sendOTPPhone('+1234567890')

      expect(result).toBe('OTP sent successfully to your phone')
    })

    it('should throw error when API response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await expect(sendOTPPhone('+1234567890')).rejects.toThrow('HTTP error! status: 500')
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Connection timeout'))

      await expect(sendOTPPhone('+1234567890')).rejects.toThrow('Connection timeout')
    })

    it('should handle empty phone parameter', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'OTP sent', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await sendOTPPhone('')

      expect(fetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/send-otp-phone',
        expect.objectContaining({
          body: JSON.stringify({ phone: '' }),
        })
      )
    })
  })

  describe('verifyOTP', () => {
    it('should complete registration successfully with custom message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'Custom registration success', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await verifyOTP('1234', 'email')

      expect(fetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: '1234', method: 'email' }),
        }
      )
      expect(result).toBe('Custom registration success')
      expect(console.log).toHaveBeenCalledWith('Registration response:', { msg: 'Custom registration success', success: true })
    })

    it('should complete registration with registration data', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'Registration complete', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const registrationData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }

      const result = await verifyOTP('1234', 'email', registrationData)

      expect(fetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code: '1234', 
            method: 'email',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          }),
        }
      )
      expect(result).toBe('Registration complete')
    })

    it('should return default message when API response has no message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await verifyOTP('1234', 'phone')

      expect(result).toBe('Registration completed successfully')
    })

    it('should throw error when registration fails', async () => {
      const mockResponse = {
        ok: false,
        status: 400
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await expect(verifyOTP('1234', 'email')).rejects.toThrow('HTTP error! status: 400')
    })

    it('should handle invalid OTP code', async () => {
      const mockResponse = {
        ok: false,
        status: 422
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await expect(verifyOTP('0000', 'email')).rejects.toThrow('HTTP error! status: 422')
    })

    it('should handle both email and phone methods', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'Registered', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await verifyOTP('1234', 'email')
      expect(fetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/register',
        expect.objectContaining({
          body: JSON.stringify({ code: '1234', method: 'email' }),
        })
      )

      await verifyOTP('5678', 'phone')
      expect(fetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/register',
        expect.objectContaining({
          body: JSON.stringify({ code: '5678', method: 'phone' }),
        })
      )
    })
  })

  describe('resendOTP', () => {
    it('should resend OTP successfully with custom message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'Custom resend message', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await resendOTP('email')

      expect(fetch).toHaveBeenCalledWith(
        'https://demo4687464.mockable.io/resend-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ method: 'email' }),
        }
      )
      expect(result).toBe('Custom resend message')
      expect(console.log).toHaveBeenCalledWith('Resend OTP response:', { msg: 'Custom resend message', success: true })
    })

    it('should return default message when API response has no message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const result = await resendOTP('phone')

      expect(result).toBe('OTP resent successfully to your phone')
    })

    it('should throw error when resend fails', async () => {
      const mockResponse = {
        ok: false,
        status: 429
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await expect(resendOTP('email')).rejects.toThrow('HTTP error! status: 429')
    })

    it('should handle both email and phone methods', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      await resendOTP('email')
      expect(fetch).toHaveBeenCalledWith(
        'https://demo4687464.mockable.io/resend-otp',
        expect.objectContaining({
          body: JSON.stringify({ method: 'email' }),
        })
      )

      const result = await resendOTP('phone')
      expect(result).toBe('OTP resent successfully to your phone')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network timeout'))

      await expect(resendOTP('email')).rejects.toThrow('Network timeout')
    })
  })

  describe('Integration scenarios', () => {
    it('should handle malformed JSON response gracefully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => { throw new Error('Invalid JSON') }
      }
      mockFetch.mockResolvedValue(mockResponse as unknown as Response)

      await expect(sendOTPEmail('test@example.com')).rejects.toThrow('Invalid JSON')
      await expect(verifyOTP('1234', 'email')).rejects.toThrow('Invalid JSON')
      await expect(resendOTP('email')).rejects.toThrow('Invalid JSON')
    })

    it('should handle different HTTP status codes', async () => {
      const statusCodes = [401, 403, 404, 500, 502]
      
      for (const status of statusCodes) {
        const mockResponse = {
          ok: false,
          status
        }
        mockFetch.mockResolvedValue(mockResponse as Response)

        await expect(sendOTPEmail('test@example.com')).rejects.toThrow(`HTTP error! status: ${status}`)
        await expect(verifyOTP('1234', 'email')).rejects.toThrow(`HTTP error! status: ${status}`)
        await expect(resendOTP('email')).rejects.toThrow(`HTTP error! status: ${status}`)
      }
    })

    it('should handle registration with complex data structures', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ msg: 'Registration successful', success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as Response)

      const complexRegistrationData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01'
        },
        contactDetails: {
          email: 'john@example.com',
          phone: '+1234567890'
        },
        preferences: {
          newsletter: true,
          terms: true
        }
      }

      const result = await verifyOTP('1234', 'email', complexRegistrationData)

      expect(fetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/register',
        expect.objectContaining({
          body: JSON.stringify({ 
            code: '1234', 
            method: 'email',
            ...complexRegistrationData
          }),
        })
      )
      expect(result).toBe('Registration successful')
    })
  })
}) 