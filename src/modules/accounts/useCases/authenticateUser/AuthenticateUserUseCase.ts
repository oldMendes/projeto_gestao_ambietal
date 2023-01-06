import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { AppError } from "@errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/providers/DateProvider/IDateProviders";

interface IRequest {
  email: string,
  password: string,
}

interface IResponse {
  user: {
    email: string,
    name: string,
  },
  token: string,
  refresh_token: string,
}

@injectable()
class AuthenticateUserUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokenRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
  ) { }

  async execute({ email, password }: IRequest): Promise<IResponse> {
    // usuario existe
    const user = await this.usersRepository.findByEmail(email);

    const {
      EXPIRES_IN_TOKEN,
      SECRET_TOKEN,
      SECRET_REFRESH_TOKEN,
      EXPIRES_IN_REFRESH_TOKEN,
      EXPIRES_REFRESH_TOKEN_DAYS
    } = auth;

    if (!user) {
      throw new AppError("Email or password incorrect");
    };

    const passwordMatch = await compare(password, user.password);

    // senha está correta
    if (!passwordMatch) {
      throw new AppError("Email or password incorrect");
    }

    // gerar jsonwebtoken
    const token = sign({}, SECRET_TOKEN, {
      subject: user.id,
      expiresIn: EXPIRES_IN_TOKEN
    });

    const refresh_token = sign({ email }, SECRET_REFRESH_TOKEN, {
      subject: user.id,
      expiresIn: EXPIRES_IN_REFRESH_TOKEN,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(EXPIRES_REFRESH_TOKEN_DAYS);

    await this.usersTokenRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    const tokenReturn: IResponse = {
      token,
      refresh_token,
      user: {
        name: user.name,
        email: user.email,
      },
    }

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };