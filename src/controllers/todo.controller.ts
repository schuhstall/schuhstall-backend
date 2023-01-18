import type {TsoaResponse} from '@tsoa/runtime';
import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Middlewares,
  Path,
  Post,
  Res,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import {RateLimit} from '../helpers/rate-limit';
import logger from '../logger';
import {TodoService} from '../services/todo.service';
import type {
  ERROR_INTERNAL_TYPE,
  ERROR_TODO_NOT_FOUND_TYPE,
} from '../types/Errors';
import {ERROR_INTERNAL, ERROR_TODO_NOT_FOUND} from '../types/Errors';
import type {TodoType} from '../types/TodoType';

@Route('v1/todos')
@Middlewares([RateLimit(120)])
@SuccessResponse(200)
export class TodoController extends Controller {
  /**
   * Get all todos
   */
  @Tags('Todos')
  @Get()
  @Example<TodoType[]>([{id: 1, title: 'My Todo'}])
  public getAllTodos(): Promise<TodoType[]> {
    return TodoService().fetchAllTodos();
  }

  /**
   * Get todo by id
   */
  @Tags('Todos')
  @Get('{id}')
  @Example<TodoType>({id: 1, title: 'My Todo'})
  public async getSpecificTodo(
    @Path() id: number,
    @Res() notFoundError: TsoaResponse<404, ERROR_TODO_NOT_FOUND_TYPE>,
    @Res() internalError: TsoaResponse<500, ERROR_INTERNAL_TYPE>,
  ): Promise<TodoType | void> {
    try {
      return await TodoService().fetchSpecificTodo(id);
    } catch (e) {
      if (e instanceof Error && e.message === ERROR_TODO_NOT_FOUND)
        notFoundError(404, ERROR_TODO_NOT_FOUND);
      // handle all remaining errors
      logger.error(e);
      internalError(500, ERROR_INTERNAL);
    }
  }

  /**
   * Create todo
   */
  @Tags('Todos')
  @Post()
  @Example<TodoType>({id: 1, title: 'My Todo'})
  public createTodo(@Body() body: Omit<TodoType, 'id'>): Promise<TodoType> {
    return TodoService().createNewTodo(body.title);
  }

  /**
   * Remove todo by id
   */
  @Tags('Todos')
  @Delete('{id}')
  public deleteSpecificTodo(@Path() id: number): Promise<void> {
    return TodoService().removeSpecificTodo(id);
  }
}
