import {PrismaClient} from '@prisma/client';
import logger from '../logger';
import {cleanUpDB} from '../tests/fixtures/clean-up-db';
import {createSampleTodos} from '../tests/fixtures/create-sample-todos';

const prisma = new PrismaClient();

async function main() {
  await cleanUpDB();
  await createSampleTodos();
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
