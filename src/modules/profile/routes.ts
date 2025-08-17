import Elysia from 'elysia';
import { profileService } from './service';
import { USER_ID } from '../../constants';
import { ProfileSchema } from './validation';

export const profileRoutes = new Elysia({
  prefix: '/api/profile',
}).get(
  '',
  async () => {
    return await profileService.getProfile(USER_ID);
  },
  {
    response: {
      200: ProfileSchema,
    },
  }
);
