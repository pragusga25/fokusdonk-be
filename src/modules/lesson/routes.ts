import Elysia, { t } from 'elysia';
import {
  LessonDetailSchema,
  LessonListSchema,
  SubmitBodySchema,
  SubmitResponseSchema,
} from './validations';
import { lessonService } from './service';
import { USER_ID } from '../../constants';

const CommonErrorSchema = t.Object({
  name: t.String(),
  message: t.String(),
});

export const lessonRoutes = new Elysia({
  prefix: '/api/lessons',
})
  .get(
    '',
    async () => {
      return await lessonService.listLessons({
        userId: USER_ID,
      });
    },
    {
      response: {
        200: LessonListSchema,
      },
    }
  )
  .get(
    '/:lessonId',
    async ({ params: { lessonId } }) => {
      return await lessonService.getLessonDetail(lessonId);
    },
    {
      params: t.Object({
        lessonId: t.String(),
      }),
      response: {
        200: LessonDetailSchema,
        404: CommonErrorSchema,
      },
    }
  )
  .post(
    '/:lessonId/submit',
    async ({ params: { lessonId }, body }) => {
      return await lessonService.submit({
        lessonId,
        ...body,
        userId: USER_ID,
      });
    },
    {
      params: t.Object({
        lessonId: t.String(),
      }),
      body: SubmitBodySchema,
      response: {
        200: SubmitResponseSchema,
        404: CommonErrorSchema,
        422: CommonErrorSchema,
      },
    }
  );
