import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const logsFileName = 'access.log';

const logsDirectory = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
function logRequest(req: Request, res: Response, next: NextFunction) {
  const logStream = fs.createWriteStream(path.join(logsDirectory, logsFileName), { flags: 'a' });

  logStream.write(`[${new Date().toISOString()}] ${req.method} ${req.url}\n`);

  // calls next middleware
  next();
}

export default logRequest;
