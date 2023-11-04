import MissingParamError from '../helpers/missing-param-error'
import UnauthorizedError from '../helpers/unauthorized-error'
import LoginRouter from './login-router'
import { jest } from '@jest/globals'

const makeSut = () => {
  const authUseCase = {
    auth: jest.fn()
  }

  const sut = new LoginRouter(authUseCase)

  return {
    sut,
    authUseCase
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if httpRequest is provided', () => {
    const { sut } = makeSut()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should call AuthUseCase with correct params', () => {
    const { sut, authUseCase } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    sut.route(httpRequest)
    expect(authUseCase.auth).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('Should return 401 when invalid credentials are provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
})
