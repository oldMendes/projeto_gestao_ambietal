
import auth from "@config/auth";
import { AppError } from "@errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/providers/DateProvider/IDateProviders";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string,
  refresh_token: string,
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokenRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
  ) { }

  async execute(token: string): Promise<ITokenResponse> {
    const { email, sub } = verify(token, auth.SECRET_REFRESH_TOKEN) as IPayload;

    const user_id = sub;

    const userToken = await this.usersTokenRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );

    if (!userToken) {
      throw new AppError("Refresh Token does not existis!");
    };

    await this.usersTokenRepository.deleteById(userToken.id);

    const refresh_token_expires_date = this.dateProvider.addDays(auth.EXPIRES_REFRESH_TOKEN_DAYS);

    const refresh_token = sign({ email }, auth.SECRET_REFRESH_TOKEN, {
      subject: sub,
      expiresIn: auth.EXPIRES_IN_REFRESH_TOKEN,
    });

    await this.usersTokenRepository.create({
      expires_date: refresh_token_expires_date,
      refresh_token,
      user_id,
    });

    const newToken = sign({}, auth.SECRET_TOKEN, {
      subject: user_id,
      expiresIn: auth.EXPIRES_IN_TOKEN
    });

    return {
      refresh_token,
      token: newToken,
    };
  }
};

export { RefreshTokenUseCase };