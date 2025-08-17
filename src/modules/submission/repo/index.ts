import { PrismaPgSubmissionRepo } from './prisma-pg';

export interface SubmissionRepo {
  create(params: ICreateSubmissionParams): Promise<Submission>;
  getByIdAndUserId(id: string, userId: bigint): Promise<Submission | null>;
}

const submissionRepo: SubmissionRepo = new PrismaPgSubmissionRepo();

export { submissionRepo };
