import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import { AppDataSource } from './database/data-source'
import { AppError } from './errors/AppError';
import { router } from './routes';
import "./shared/index";

AppDataSource.initialize()
  .then(() => {
    const app = express()
    app.use(express.json())
    app.use(router)

    app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          message: err.message
        })
      };

      return response.status(500).json({
        status: "error",
        message: `Internal server error = ${err.message}`,
      });
    })

    console.log("Server is running");
    return app.listen(10001)
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })



// const app = express();

// app.use(express.json());

// app.use(router);

// app.listen(3333);