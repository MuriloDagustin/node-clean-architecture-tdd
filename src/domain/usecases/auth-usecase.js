import { InvalidParamError } from '../../utils/errors'

export default class AuthUseCase {
  constructor (emailRepository) {
    this.emailRepository = emailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new InvalidParamError('email')
    }

    if (!password) {
      throw new InvalidParamError('password')
    }

    if (!this.emailRepository?.load) {
      throw new InvalidParamError('emailRepository')
    }

    const user = this.emailRepository.load(email)

    if (!user) {
      return null
    }

    return user
  }
}
