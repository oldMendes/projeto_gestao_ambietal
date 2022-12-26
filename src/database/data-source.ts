import 'reflect-metadata';
import { DataSource } from "typeorm";


// atualizados
// criar migration -> yarn typeorm migration:create ./src/database/migrations/CreateCategory
// rodar migration -> yarn typeorm migration:run -d src/database/data-source.ts
// reverter migration -> yarn typeorm migration:revert -d src/database/data-source.ts
export const AppDataSource = new DataSource({
  type: "postgres",
  // mandam colocar local
  host: "localhost",
  port: 5431,
  username: "docker",
  password: "12345",
  database: "gestao_ambiental",
  synchronize: false,
  logging: false,
  entities: ["./src/modules/**/entities/*.ts"],
  migrations: ["./src/database/migrations/*.ts"],
  subscribers: [],
})

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!")
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization", err)
//   })


// export { AppDataSource }