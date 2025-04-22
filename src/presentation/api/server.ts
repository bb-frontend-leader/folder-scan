import express, { json } from 'express';

import { corsMiddleware } from './middlewares/cors';
import { ovasRouter } from './routes/ovas.router';


export class Server {
    private app: express.Application;
    private port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.app.use(json());
        this.app.use(corsMiddleware())
        this.app.disable('x-powered-by');
        this.app.use('/', ovasRouter)
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log('\n' + '='.repeat(40));
            console.log('\x1b[32m🚀  API - Starting\x1b[0m'); // Verde para el título
            console.log(`Server is running on port \x1b[33m${this.port}\x1b[0m`); // Amarillo para el puerto
            console.log('='.repeat(40) + '\n');
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}