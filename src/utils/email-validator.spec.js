import { jest } from '@jest/globals'
import validator from '../../__mocks__/validator'

const makeSut = () => {
  const sut = validator

  return {
    sut
  }
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()
    const isEmailValid = sut.isEmail('valid-email@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = {
      isEmail: jest.fn(() => false)
    }
    const isEmailValid = sut.isEmail('invalid-email')
    expect(isEmailValid).toBe(false)
  })
})
