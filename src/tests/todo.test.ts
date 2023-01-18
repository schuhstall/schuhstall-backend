import prisma from '../prisma/prismaDB';
import {TodoService} from '../services/todo.service';
import {cleanUpDB} from './fixtures/clean-up-db';
import {createSampleTodos} from './fixtures/create-sample-todos';

describe('Referral', () => {
  beforeEach(async () => {
    await createSampleTodos();
  });

  afterEach(async () => {
    await cleanUpDB();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Get all todos', async () => {
    const todos = await TodoService().fetchAllTodos();
    expect(todos.length).toEqual(3);
  });

  it('Create a todo', async () => {
    const createdTodo = await TodoService().createNewTodo(
      'This is a unique Title',
    );
    const fetchedTodo = await TodoService().fetchSpecificTodo(
      createdTodo.id ?? -1,
    );
    expect(createdTodo).toEqual(fetchedTodo);
  });
});
