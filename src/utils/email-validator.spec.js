import { jest } from '@jest/globals'
import EmailValidator from './email-validator'

const makeSut = () => {
  const sut = EmailValidator

  return {
    sut
  }
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()
    const isEmailValid = sut.isValid('valid-email@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = {
      isValid: jest.fn(() => false)
    }
    const isEmailValid = sut.isValid('invalid-email')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const { sut } = makeSut()
    sut.isValid('email@email.com')
    expect(sut.isValid).toHaveBeenCalledWith('email@email.com')
  })
})
