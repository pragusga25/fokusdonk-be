import { BaseError } from '../../utils/error';

export class ProfileNotFoundError extends BaseError {
  constructor(userId: bigint) {
    super(`Profile for user with ID ${userId} not found`, 404);
    this.name = 'ProfileNotFoundError';
  }
}
