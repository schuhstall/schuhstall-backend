import {
  Controller,
  Example,
  Get,
  Middlewares,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
import {RateLimit} from '../helpers/rate-limit';

@Route('v1/time')
@Middlewares([RateLimit(120)])
@SuccessResponse(200)
export class TimeController extends Controller {
  /**
   * Get the current timestamp
   */
  @Tags('Time')
  @Get()
  @Security('nobody')
  @Example<number>(1673799923000)
  public getCurrentTimestamp(): number {
    return Date.now();
  }
}
