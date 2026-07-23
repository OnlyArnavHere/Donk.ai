import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { env } from '../config/env.js';
const uploadDirectory = path.resolve(env.uploadDir);
fs.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer.diskStorage({ destination: (_, __, cb) => cb(null, uploadDirectory), filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`) });
export const upload = multer({ storage, limits: { fileSize: env.maxFileSize } });
