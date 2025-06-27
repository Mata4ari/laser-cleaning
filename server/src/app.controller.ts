import { Controller, Get, Res, Req ,Next} from '@nestjs/common';
import { Response, Request , NextFunction} from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class AppController {
  @Get()
  serveRoot(@Res() res: Response) {
    this.serveIndex(res);
  }

  @Get('*')
  serveClient(@Req() req: Request, @Res() res: Response,@Next() next: NextFunction) {
    const requestedPath = req.path;

    if (requestedPath.startsWith('/api')||requestedPath.startsWith('/auth')||requestedPath.startsWith('/uploads')) {
      return next();
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
