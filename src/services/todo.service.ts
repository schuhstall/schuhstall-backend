import type {PrismaClient} from '@prisma/client';
import prisma from '../prisma/prismaDB';
import {ERROR_TODO_NOT_FOUND} from '../types/Errors';
import type {TodoType} from '../types/TodoType';

export interface ITodoService {
  fetchAllTodos: () => Promise<TodoType[]>;

  fetchSpecificTodo: (id: number) => Promise<TodoType>;
  createNewTodo: (title: string) => Promise<TodoType>;
  removeSpecificTodo: (id: number) => Promise<void>;
}

type TodoServiceDependencies = {
  db?: PrismaClient;
};

export const TodoService = (
  {db = prisma}: TodoServiceDependencies = {db: prisma},
): ITodoService => {
  const fetchAllTodos = () => {
    return db.todo.findMany();
  };

  const fetchSpecificTodo = async (id: number) => {
    const todo = await db.todo.findFirst({where: {id}});

    if (!todo) throw new Error(ERROR_TODO_NOT_FOUND);
    return todo;
  };

  const createNewTodo = (title: string) => {
    return db.todo.create({data: {title}});
  };

  const removeSpecificTodo = async (id: number) => {
    const res = await db.todo.delete({where: {id}});

    if (!res) throw new Error(ERROR_TODO_NOT_FOUND);
  };

  return {
    fetchAllTodos,
    fetchSpecificTodo,
    createNewTodo,
    removeSpecificTodo,
  };
};
