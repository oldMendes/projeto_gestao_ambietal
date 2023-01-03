import auth from "@config/auth";
import { UsersTokensRepository } from "@modules/accounts/repositories/implementations/UsersTokensRepository";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
};

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {

  const authHeader = request.headers.authorization;
  const usersTokenRepository = new UsersTokensRepository();

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  };

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token, auth.SECRET_REFRESH_TOKEN
    ) as IPayload;


    const user = await usersTokenRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    next();
  } catch (error) {
    throw new AppError("Invalid token!", 401);

  }
}