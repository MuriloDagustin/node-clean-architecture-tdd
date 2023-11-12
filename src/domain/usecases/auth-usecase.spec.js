import { jest } from '@jest/globals'
import { InvalidParamError } from '../../utils/errors'

const makeSut = () => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepository()

  const sut = {
    auth: jest.fn(async (email, password) => {
      if (!email) {
        throw new InvalidParamError('email')
      }

      if (!password) {
        throw new InvalidParamError('password')
      }

      loadUserByEmailRepository.load(email)

      return 'valid_acces'
    })
  }

  return {
    sut,
    loadUserByEmailRepository
  }
}

const makeLoadUserByEmailRepository = () => {
  return {
    load: jest.fn((email) => {})
  }
}

describe('Auth UseCase', () => {
  it('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new InvalidParamError('email'))
  })

  it('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_mail@mail.com')
    expect(promise).rejects.toThrow(new InvalidParamError('password'))
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    sut.auth('any_mail@mail.com', 'any_password')
    expect(loadUserByEmailRepository.load).toHaveBeenCalledWith('any_mail@mail.com')
  })
})
