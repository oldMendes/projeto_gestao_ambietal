import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";
import { IUsersRepository } from "src/modules/accounts/repositories/IUsersRepository";
import { container } from "tsyringe";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);