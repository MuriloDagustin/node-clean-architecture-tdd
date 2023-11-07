import { jest } from '@jest/globals'

const makeSut = () => {
  const sut = makeEmailValidator()

  return {
    sut
  }
}

const makeEmailValidator = () => {
  return {
    isValid: jest.fn(() => true)
  }
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()
    const isEmailValid = sut.isValid('valid-email@email.com')
    expect(isEmailValid).toBe(true)
  })
})
