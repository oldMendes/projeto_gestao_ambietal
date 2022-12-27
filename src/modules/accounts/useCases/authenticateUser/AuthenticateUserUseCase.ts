import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { AppError } from "../../../../errors/AppError";

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
}

@injectable()
class AuthenticateUserUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute({ email, password }: IRequest): Promise<IResponse> {
    // usuario existe
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect");
    };

    const passwordMatch = await compare(password, user.password);

    // senha está correta
    if (!passwordMatch) {
      throw new AppError("Email or password incorrect");
    }

    // gerar jsonwebtoken
    const token = sign({}, "ecd4a7e106f1edb67da95277af4036e2", {
      subject: user.id,
      expiresIn: "1d"
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    }

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };