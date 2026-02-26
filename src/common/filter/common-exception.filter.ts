import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

@Catch() // 括號留空表示捕捉所有類型的錯誤
class CommonExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CommonExceptionFilter.name, {
    timestamp: true,
  });

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const url = request.url;
    const method = request.method;

    // 判斷是否為已知的 HttpException，否則視為 500 內部錯誤
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 取得錯誤訊息

    const message = (() => {
      if (exception instanceof HttpException) {
        return exception.getResponse();
      }

      // 非 HttpException（例如未預期的 Error）
      if (isProduction && status === 500) {
        return 'Internal server error'; // 生產環境隱藏細節
      }

      if (exception instanceof Error) {
        return exception.message;
      }
      return 'Internal server error';
    })();

    const stack = exception instanceof Error ? exception.stack : null;

    const logDetail = {
      status,
      timestamp: new Date().toISOString(),
      path: url,
      method,
      message,
      stack,
    };

    this.logger.error(`HTTP ${method}_${status}_${url}`, logDetail);

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  } // catch
  //
}

export { CommonExceptionFilter };
