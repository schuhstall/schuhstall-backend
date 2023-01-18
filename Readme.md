# THORWallet Backend

| Statements                                                                         | Branches                                                                         | Functions                                                                         | Lines                                                                         |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-81.48%25-yellow.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-37.5%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-71.42%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-90.9%25-brightgreen.svg?style=flat) |

## Start Backend

1. Install the dependencies

   ```
   yarn
   ```

1. Add the DB connection string to the DATABASE_URL env variable in `.env`

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/backend-db"
   ```

1. Start the webserver

   ```
   yarn dev
   ```

1. Visit swagger e.g.

   http://localhost:8080/docs

## Setup development environment

1. Install the dependencies

   ```
   yarn
   ```

2. Add the Postgres connection string to the .env file and sync DB schema:

   ```
   prisma migrate dev
   ```

3. Start the webserver
   ```
   yarn dev
   ```

## DB Schema Changes

The DB schema lives inside the `schema.prisma` file.
If you make changes in the schema file, you always need to create a migration:

```
 prisma migrate dev --name your-migration-name
```

Use the `--create-only` flag, to just create a migration without applying it (e.g. to add some default data in the migration.sql)
Afterwards you can apply the migration using `prisma migrate deploy`

### Important Note:

Migrations are automatically applied in the CI/CD Pipeline. Make sure that you test the migrations locally, before committing to `Main` or `Stage`

## Environment variables

| Key                   | Type                          | Description                                                                                          |
| --------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| DATABASE_URL          |                               | Connection string to the DB (used by prisma)                                                         |
| PORT                  |                               | Port number where the backend should be running                                                      |
| NODE_ENV              | "development" or "production" | Node environment. Production should be enabled if not developing locally                             |
