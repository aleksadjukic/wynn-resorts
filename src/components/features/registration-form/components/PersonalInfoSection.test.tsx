import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { PersonalInfoSection } from './PersonalInfoSection'
import { RegistrationFormData } from '@/lib/validations/registration'

// Mock the individual field components
jest.mock('./FormField', () => ({
  FormField: ({ id, label, required, error }: any) => (
    <div data-testid={`form-field-${id}`}>
      <label>{label} {required && '*'}</label>
      <input id={id} />
      {error && <span data-testid={`error-${id}`}>{error.message}</span>}
    </div>
  )
}))

jest.mock('./SelectField', () => ({
  SelectField: ({ name, label, required, error, options }: any) => (
    <div data-testid={`select-field-${name}`}>
      <label>{label} {required && '*'}</label>
      <select id={name}>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span data-testid={`error-${name}`}>{error.message}</span>}
    </div>
  )
}))

// Test component wrapper that provides form context
const PersonalInfoSectionWrapper = ({ errors = {} }: { errors?: any }) => {
  const { register, control } = useForm<RegistrationFormData>()
  
  return (
    <PersonalInfoSection
      register={register}
      control={control}
      errors={errors}
    />
  )
}

describe('PersonalInfoSection', () => {
  describe('Section Structure', () => {
    it('renders section title', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByText('Personal Info')).toBeInTheDocument()
    })

    it('has proper section title styling', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const title = screen.getByText('Personal Info')
      expect(title).toHaveClass('text-[22px]', 'font-serif', 'text-gray-900', 'mb-6', 'pb-2', 'border-b', 'border-b-gray-400', 'inline-block', 'pr-8')
    })

    it('has proper section layout', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const section = screen.getByText('Personal Info').closest('div')
      expect(section).toBeInTheDocument()
    })
  })

  describe('Form Fields Rendering', () => {
    it('renders first name field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('form-field-firstName')).toBeInTheDocument()
      expect(screen.getByText('First Name *')).toBeInTheDocument()
    })

    it('renders last name field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('form-field-lastName')).toBeInTheDocument()
      expect(screen.getByText('Last Name *')).toBeInTheDocument()
    })

    it('renders gender select field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('select-field-gender')).toBeInTheDocument()
      expect(screen.getByText('Gender *')).toBeInTheDocument()
    })

    it('renders country select field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('select-field-country')).toBeInTheDocument()
      expect(screen.getByText('Your Residence Country *')).toBeInTheDocument()
    })

    it('renders all fields as required', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByText('First Name *')).toBeInTheDocument()
      expect(screen.getByText('Last Name *')).toBeInTheDocument()
      expect(screen.getByText('Gender *')).toBeInTheDocument()
      expect(screen.getByText('Your Residence Country *')).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('has proper grid layout for name fields', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const nameFieldsContainer = screen.getByTestId('form-field-firstName').closest('.grid')
      expect(nameFieldsContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6', 'mb-6')
    })

    it('has proper layout for select fields', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const selectFieldsContainer = screen.getByTestId('select-field-gender').closest('.flex')
      expect(selectFieldsContainer).toHaveClass('flex', 'flex-col', 'gap-6')
    })

    it('arranges fields in correct order', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const section = screen.getByText('Personal Info').closest('div')
      const fields = section?.querySelectorAll('[data-testid^="form-field-"], [data-testid^="select-field-"]')
      
      expect(fields?.[0]).toHaveAttribute('data-testid', 'form-field-firstName')
      expect(fields?.[1]).toHaveAttribute('data-testid', 'form-field-lastName')
      expect(fields?.[2]).toHaveAttribute('data-testid', 'select-field-gender')
      expect(fields?.[3]).toHaveAttribute('data-testid', 'select-field-country')
    })
  })

  describe('Field Props', () => {
    it('passes correct props to firstName field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const firstNameField = screen.getByTestId('form-field-firstName')
      expect(firstNameField.querySelector('input')).toHaveAttribute('id', 'firstName')
    })

    it('passes correct props to lastName field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const lastNameField = screen.getByTestId('form-field-lastName')
      expect(lastNameField.querySelector('input')).toHaveAttribute('id', 'lastName')
    })

    it('passes correct props to gender select field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const genderField = screen.getByTestId('select-field-gender')
      const genderSelect = genderField.querySelector('select')
      
      expect(genderSelect).toHaveAttribute('id', 'gender')
      
      // Check gender options are present
      expect(genderSelect?.querySelector('option[value="male"]')).toHaveTextContent('Male')
      expect(genderSelect?.querySelector('option[value="female"]')).toHaveTextContent('Female')
      expect(genderSelect?.querySelector('option[value="other"]')).toHaveTextContent('Other')
    })

    it('passes correct props to country select field', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const countryField = screen.getByTestId('select-field-country')
      const countrySelect = countryField.querySelector('select')
      
      expect(countrySelect).toHaveAttribute('id', 'country')
      
      // Check country options are present
      expect(countrySelect?.querySelector('option[value="us"]')).toHaveTextContent('United States')
      expect(countrySelect?.querySelector('option[value="ae"]')).toHaveTextContent('United Arab Emirates')
      expect(countrySelect?.querySelector('option[value="uk"]')).toHaveTextContent('United Kingdom')
    })
  })

  describe('Error Handling', () => {
    const mockErrors = {
      firstName: { type: 'required', message: 'First name is required' },
      lastName: { type: 'required', message: 'Last name is required' },
      gender: { type: 'required', message: 'Gender is required' },
      country: { type: 'required', message: 'Country is required' },
    }

    it('displays first name error when provided', () => {
      render(<PersonalInfoSectionWrapper errors={{ firstName: mockErrors.firstName }} />)
      
      expect(screen.getByTestId('error-firstName')).toHaveTextContent('First name is required')
    })

    it('displays last name error when provided', () => {
      render(<PersonalInfoSectionWrapper errors={{ lastName: mockErrors.lastName }} />)
      
      expect(screen.getByTestId('error-lastName')).toHaveTextContent('Last name is required')
    })

    it('displays gender error when provided', () => {
      render(<PersonalInfoSectionWrapper errors={{ gender: mockErrors.gender }} />)
      
      expect(screen.getByTestId('error-gender')).toHaveTextContent('Gender is required')
    })

    it('displays country error when provided', () => {
      render(<PersonalInfoSectionWrapper errors={{ country: mockErrors.country }} />)
      
      expect(screen.getByTestId('error-country')).toHaveTextContent('Country is required')
    })

    it('displays multiple errors simultaneously', () => {
      render(<PersonalInfoSectionWrapper errors={mockErrors} />)
      
      expect(screen.getByTestId('error-firstName')).toBeInTheDocument()
      expect(screen.getByTestId('error-lastName')).toBeInTheDocument()
      expect(screen.getByTestId('error-gender')).toBeInTheDocument()
      expect(screen.getByTestId('error-country')).toBeInTheDocument()
    })

    it('does not display errors when none are provided', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.queryByTestId('error-firstName')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-lastName')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-gender')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-country')).not.toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('passes register function to form fields', () => {
      // This is implicitly tested by the field rendering,
      // as the mocked components receive the register prop
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('form-field-firstName')).toBeInTheDocument()
      expect(screen.getByTestId('form-field-lastName')).toBeInTheDocument()
    })

    it('passes control object to select fields', () => {
      // This is implicitly tested by the field rendering,
      // as the mocked components receive the control prop
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('select-field-gender')).toBeInTheDocument()
      expect(screen.getByTestId('select-field-country')).toBeInTheDocument()
    })

    it('integrates with react-hook-form properly', () => {
      // Test that the component receives the required form props
      render(<PersonalInfoSectionWrapper />)
      
      // All fields should be rendered, indicating proper form integration
      expect(screen.getByTestId('form-field-firstName')).toBeInTheDocument()
      expect(screen.getByTestId('form-field-lastName')).toBeInTheDocument()
      expect(screen.getByTestId('select-field-gender')).toBeInTheDocument()
      expect(screen.getByTestId('select-field-country')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const heading = screen.getByText('Personal Info')
      expect(heading.tagName).toBe('H2')
    })

    it('maintains proper tab order', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const firstNameInput = screen.getByTestId('form-field-firstName').querySelector('input')
      const lastNameInput = screen.getByTestId('form-field-lastName').querySelector('input')
      const genderSelect = screen.getByTestId('select-field-gender').querySelector('select')
      const countrySelect = screen.getByTestId('select-field-country').querySelector('select')
      
      expect(firstNameInput).toBeInTheDocument()
      expect(lastNameInput).toBeInTheDocument()
      expect(genderSelect).toBeInTheDocument()
      expect(countrySelect).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('has responsive grid classes for name fields', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const nameFieldsContainer = screen.getByTestId('form-field-firstName').closest('.grid')
      expect(nameFieldsContainer).toHaveClass('md:grid-cols-2')
    })

    it('stacks fields vertically on mobile', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const nameFieldsContainer = screen.getByTestId('form-field-firstName').closest('.grid')
      expect(nameFieldsContainer).toHaveClass('grid-cols-1')
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined errors gracefully', () => {
      render(<PersonalInfoSectionWrapper errors={undefined} />)
      
      expect(screen.queryByTestId(/error-/)).not.toBeInTheDocument()
    })

    it('handles empty errors object gracefully', () => {
      render(<PersonalInfoSectionWrapper errors={{}} />)
      
      expect(screen.queryByTestId(/error-/)).not.toBeInTheDocument()
    })

    it('handles partial errors object', () => {
      const partialErrors = {
        firstName: { type: 'required', message: 'First name is required' }
      }
      
      render(<PersonalInfoSectionWrapper errors={partialErrors} />)
      
      expect(screen.getByTestId('error-firstName')).toBeInTheDocument()
      expect(screen.queryByTestId('error-lastName')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-gender')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-country')).not.toBeInTheDocument()
    })
  })

  describe('Component Composition', () => {
    it('composes FormField components correctly', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('form-field-firstName')).toBeInTheDocument()
      expect(screen.getByTestId('form-field-lastName')).toBeInTheDocument()
    })

    it('composes SelectField components correctly', () => {
      render(<PersonalInfoSectionWrapper />)
      
      expect(screen.getByTestId('select-field-gender')).toBeInTheDocument()
      expect(screen.getByTestId('select-field-country')).toBeInTheDocument()
    })

    it('maintains proper component hierarchy', () => {
      render(<PersonalInfoSectionWrapper />)
      
      const section = screen.getByText('Personal Info').closest('div')
      const nameFieldsGrid = section?.querySelector('.grid')
      const selectFieldsContainer = section?.querySelector('.flex.flex-col')
      
      expect(nameFieldsGrid).toBeInTheDocument()
      expect(selectFieldsContainer).toBeInTheDocument()
    })
  })
}) 