import { Controller, Get, Logger, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class FileController {
  constructor(private readonly logger: Logger) {}

  @Get('/actions.json')
  async getActionsFile(@Res() res: Response) {
    return res.status(200).json({
      rules: [
        {
          pathPattern: '/api/v1/actions/**',
          apiPath: '/api/v1/actions/**',
        },
      ],
    });
  }
}
