-- CreateEnum
CREATE TYPE "public"."ProblemType" AS ENUM ('MULTIPLE_CHOICE', 'INPUT');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "last_activity_date" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Problem" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "problem_type" "public"."ProblemType" NOT NULL,
    "order" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problem_option" (
    "id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "problem_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problem_answer" (
    "problem_id" TEXT NOT NULL,
    "answer" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_answer_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "public"."submission" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "total_problems" INTEGER NOT NULL,
    "correct_count" INTEGER NOT NULL,
    "earned_xp" INTEGER NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_progress" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "best_score" INTEGER NOT NULL DEFAULT 0,
    "total_xp" BIGINT NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_order_key" ON "public"."lesson"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_lesson_id_order_key" ON "public"."Problem"("lesson_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_lesson_id_key" ON "public"."user_progress"("user_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "public"."Problem" ADD CONSTRAINT "Problem_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."problem_option" ADD CONSTRAINT "problem_option_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "public"."Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."problem_answer" ADD CONSTRAINT "problem_answer_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "public"."Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
