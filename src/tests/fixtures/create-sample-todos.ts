import prisma from '../../prisma/prismaDB';

export const createSampleTodos = async () => {
  await prisma.todo.createMany({
    data: [{title: 'Todo 1'}, {title: 'Todo 2'}, {title: 'Todo 3'}],
  });
};
