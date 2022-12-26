import express from 'express';
import { AppDataSource } from './database/data-source'
import { router } from './routes';
import "./shared/index";

AppDataSource.initialize()
  .then(() => {
    const app = express()
    app.use(express.json())
    app.use(router)
    return app.listen(10001)
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })



// const app = express();

// app.use(express.json());

// app.use(router);

// app.listen(3333);