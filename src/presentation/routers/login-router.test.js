import MissingParamError from '../helpers/missing-param-error'
import ServerError from '../helpers/server-error'
import UnauthorizedError from '../helpers/unauthorized-error'
import LoginRouter from './login-router'
import { jest } from '@jest/globals'

const makeSut = () => {
  const authUseCase = makeAuthUseCase()
  const sut = new LoginRouter(authUseCase)

  return {
    sut,
    authUseCase
  }
}

const makeAuthUseCase = () => {
  return {
    auth: jest.fn(async () => 'valid_token')
  }
}

const makeAuthUseCaseWithError = () => {
  return {
    auth: jest.fn(async () => {
      throw new Error()
    })
  }
}

const makeAuthUseCaseWithInvalidAccessToken = () => {
  return {
    auth: jest.fn(async () => null)
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if httpRequest is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCase } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCase.auth).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    const sut = new LoginRouter(makeAuthUseCaseWithInvalidAccessToken())
    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        password: 'invalid_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AuthUseCase has no auth method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCase } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(await authUseCase.auth())
  })

  test('Should return 500 if AuthUseCase throws', async () => {
    const sut = new LoginRouter(makeAuthUseCaseWithError())
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
