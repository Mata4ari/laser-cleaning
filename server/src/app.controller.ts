import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class AppController {
  @Get()
  serveRoot(@Res() res: Response) {
    this.serveIndex(res);
  }

  @Get('*')
  serveClient(@Req() req: Request, @Res() res: Response) {
    const requestedPath = req.path;

    if (requestedPath.startsWith('/api')) {
      return res.status(404).send('Not found');
    }

    const basePath = join(__dirname, '..', '..', 'client', 'build');
    const filePath = join(basePath, requestedPath);

    if (existsSync(filePath) && !filePath.endsWith('index.html')) {
      return res.sendFile(filePath);
    }

    this.serveIndex(res);
  }

  private serveIndex(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'client', 'build', 'index.html'));
  }
}
