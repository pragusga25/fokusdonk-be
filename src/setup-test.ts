import { beforeAll } from 'bun:test';
import db from './db';
import { seed } from './db/seed';
import { cache } from './cache';

beforeAll(async () => {
  // Delete All Data
  console.log('Deleting all data...');
  const [delr] = await Promise.all([
    cache.del('lesson:list:1'),
    db.user.deleteMany(),
    db.lesson.deleteMany(),
    db.submission.deleteMany(),
    db.userProgress.deleteMany(),
    db.problem.deleteMany(),
    db.problemOption.deleteMany(),
    db.problemAnswer.deleteMany(),
  ]);
  console.log(`Deleted ${delr} keys from cache.`);
  console.log('All data deleted successfully.');

  console.log('Seeding database...');
  await seed();
});
