'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from '@coperex-interfer/shared';
import { helmetConfiguration } from '@coperex-interfer/shared';
import { requestLimit } from '@coperex-interfer/shared';
import { errorHandler } from '../middlewares/handle-errors.js';

import companyRoutes from '../src/companies/company.routes.js';


const BASE_PATH = '/api/v1/coperexAdmin';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(requestLimit);
    app.use(morgan('dev'));
}

const routes = (app) => {

    app.get(`${BASE_PATH}/Health`, (request, response) => {
        response.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'Coperex Interfer Admin Server'
        })
    })

    app.use(`${BASE_PATH}/companies`, companyRoutes);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado en Admin API'
        })
    })
}

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        await dbConnection();
        middlewares(app);
        routes(app);

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Coperex Interfer Admin Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });

    } catch (error) {
        console.error(`Error starting Admin Server: ${error.message}`);
        process.exit(1);
    }
}