import { jest } from '@jest/globals'
import { InvalidParamError } from '../../utils/errors'

const makeSut = () => {
  const sut = {
    auth: jest.fn(async (email) => {
      if (!email) {
        throw new InvalidParamError('Email is incorrect')
      }

      return 'valid_acces'
    })
  }

  return {
    sut
  }
}

describe('Auth UseCase', () => {
  it('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })
})
