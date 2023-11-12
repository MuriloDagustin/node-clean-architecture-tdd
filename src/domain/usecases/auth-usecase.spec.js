import { jest } from '@jest/globals'
import { InvalidParamError } from '../../utils/errors'
import AuthUseCase from './auth-usecase'

const makeSut = () => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepository)

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

  it('Should throw if no repository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_mail@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('emailRepository'))
  })

  it('Should throw if repository has no auth method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_mail@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('emailRepository'))
  })
})
