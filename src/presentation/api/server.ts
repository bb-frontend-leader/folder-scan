import express, { json } from 'express';

import { ovasRouter } from './routes/ovas.router';


export class Server {
    private app: express.Application;
    private port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.app.disable('x-powered-by');
        this.app.use(json());
        this.app.use('/ovas', ovasRouter)
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}