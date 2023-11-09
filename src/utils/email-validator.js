import { jest } from '@jest/globals'
import validator from 'validator'

export default {
  isValid: jest.fn((email) => validator.isEmail(email))
}
