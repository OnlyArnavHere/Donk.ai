import { app } from './app.js'; import { env } from './config/env.js'; import { connectDatabase } from './config/database.js';
try { await connectDatabase(); app.listen(env.port,()=>console.log(`Dunk AI backend listening on ${env.port}`)); } catch (error) { console.error('Startup failed',error); process.exitCode=1; }
