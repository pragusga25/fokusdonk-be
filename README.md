# FokusDonk Backend

This project is the backend service for the FokusDonk application, built with [Bun](https://bun.sh/), [TypeScript](https://www.typescriptlang.org/), [ElysiaJS](https://elysiajs.com/), [Prisma ORM](https://www.prisma.io/), and [PostgreSQL](https://www.postgresql.org/).

## Live URL

- <https://fokusdonk-api.pragusga.com/>
- Docs: <https://fokusdonk-api.pragusga.com/docs>

## Prerequisites

- [Bun](https://bun.sh/) installed (see [installation guide](https://bun.sh/docs/installation))
- [PostgreSQL](https://www.postgresql.org/) running locally or via Docker - If you don't have PostgreSQL installed, you can use Docker:

        ```bash
        docker compose up -d
        # or, if your Docker version uses the older syntax
        docker-compose up -d
        ```
        This will start a PostgreSQL instance as defined in `docker-compose.yml`.

- [Redis](https://redis.io/) (optional, for caching) can also be run locally or with Docker Compose using the same command above. If you want to enable caching features, ensure Redis is running:

        ```bash
        docker compose up -d
        # or, if your Docker version uses the older syntax
        docker-compose up -d
        ```
        This will start a Redis instance as defined in `docker-compose.yml`.

## Setup

1. **Clone the repository** (if you haven't already):

```bash
git clone https://github.com/pragusga25/fokusdonk-be.git
cd fokusdonk-be
```

2. **Install dependencies:**

```bash
bun install
```

3. **Configure environment variables:**

- Copy the example environment file and adjust the values as needed:

```bash
cp .env.example .env
# If the above command does not work on your system, copy the file manually and rename it to `.env`.
# Edit .env to match your local setup
```

4. **Migrate database:**

```bash
# Apply database migrations
bunx prisma migrate deploy
```

5. **Generate prisma client:**

```bash
# Generate Prisma client
bunx prisma generate
```

## Running the Project

To start the development server:

```bash
bun dev
```

The server will start on the `PORT` specified in your `.env` file (default is 3000 if not set). Access it at [http://localhost:PORT](http://localhost:PORT).

You can also view the API documentation at [http://localhost:PORT/docs](http://localhost:PORT/docs) once the server is running.

## Running Tests

This project uses Bun's test runner. All tests are located in a single file:

- `./src/__tests__/index.test.ts`

**Important:**

- The tests use the actual database configured in your `.env` file. Make sure your PostgreSQL database is running and accessible before running the tests.

To run the tests:

```bash
bun run test
```

## Seeding Database

To seed databae with seed data in this file:

- `./src/db/seed.ts`

simply run this command:

```bash
bun run seed
```

## Database Migration

This project uses [Prisma](https://www.prisma.io/) for database migrations and schema management.

### Run Migrations

To apply migrations to your database:

```bash
bunx prisma migrate deploy
```

Or, to create a new migration after updating your Prisma schema:

```bash
bunx prisma migrate dev --name <migration_name>
```

### Prisma Studio

To visually inspect and edit your database data:

```bash
bunx prisma studio
```

## Environment Variables

The following environment variables are used to configure the application:

```
DATABASE_URL=postgres://fokusdonk:fokuslah12dev90@localhost:5435/fokuslah
NODE_ENV=development
PORT=3000
# This is optional, but recommended for caching. Remove this line if you do not have Redis.
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:8080
```

- `DATABASE_URL`: Connection string for the PostgreSQL database. Matches the default credentials in `docker-compose.yml`.
- `NODE_ENV`: The environment mode. Use `development` for local development.
- `PORT`: The port the server will run on. Default is 3000.
- `REDIS_URL`: (Optional) Connection string for Redis, used for caching. If not set, caching features will be disabled.
- `CORS_ORIGIN`: Allow CORS requests from the specified origin, seperate multiple origins with commas

You can copy these into your `.env` file or use the provided `.env.example` as a template.

## Project Structure

- `src/` - Main source code
- `prisma/` - Prisma schema and migrations
- `docker-compose.yml` - Docker Compose config for PostgreSQL
- `.env.example` - Example environment variables

## Notes

- Ensure your `.env` file is properly configured before running the project.
- If you use Docker for PostgreSQL, default credentials are set in `docker-compose.yml` and `.env.example`.
- The server port is controlled by the `PORT` variable in `.env` (default: 3000).
- Tests require a running and accessible database instance.

## Tradeoffs

This project uses an ORM (Prisma ORM) to speed up development and reduce boilerplate when interacting with the database. Using Prisma allows for rapid prototyping, type safety, and easier migrations. However, the downside is that ORMs can introduce some performance overhead and may not always generate the most optimized queries compared to hand-written SQL, especially for complex or highly-tuned workloads.

## How I'd handle 1000+ students simultaneously

To handle 1000+ students simultaneously, I would implement caching for frequently accessed data, such as lesson content, using a fast in-memory store like Redis. Caching reduces database load and improves response times, ensuring the system remains responsive even under high concurrent usage.

## Time spent and what I cut/didn't build

I spent about 12 hours to create this project and I built all the requirements specified. Nothing was cut or left unimplemented. However, if I wanted to make this project truly perfect, I would add more features such as a leaderboard, gamification elements, and comprehensive feedback.

## Product Reviews

### Things that work well for teens

- There is an analysis of progress for each question type, allowing students to identify which types of questions they are still weak at.
- The quiz answering process is quite smooth.

### Improvements

- Sometimes the images in the quiz are not in the best quality, making them look blurry.
- There is no gamification, which can make users get bored easily when using the app.
- There are no comprehensive explanations provided for each question.
- There is no leaderboard to motivate users to compete with each other.
- LaTeX is sometimes not rendered properly.
  ![LTX](./ltx.png)
  ![Blurry](./blurr.png)

## Engaging Post-Lesson Progress Design

### Approach

My approach to designing engaging post-lesson progress reveals for teens combines **clear insights, gamification, and social motivation**.

#### Key Elements

- 📊 **Visual Progress Tracking**  
  Display charts or badges that highlight strengths and show which question types still need improvement.

- 🎮 **Gamification Elements**  
  Add streaks, achievements, and small rewards to keep the experience fun and encourage consistency.

- 🏆 **Leaderboards & Friendly Competition**  
  Motivate students by letting them compare progress with peers in a healthy, encouraging way.

- 💡 **Personalized Feedback**  
  Provide feedback or hints after each lesson, so students not only see their score but also understand how to improve.
