import type {PrismaClient} from '@prisma/client';
import {mockDeep, mockReset} from 'jest-mock-extended';
import {beforeEach} from 'node:test';

export const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});
