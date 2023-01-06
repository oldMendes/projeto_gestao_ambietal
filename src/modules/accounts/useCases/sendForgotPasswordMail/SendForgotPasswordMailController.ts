import { Response, Request } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";


class SendForgotPasswordMailController {

  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const sendForgotPasswordMainUseCase = container.resolve(
      SendForgotPasswordMailUseCase
    );

    await sendForgotPasswordMainUseCase.execute(email);

    return response.send();
  }

};

export { SendForgotPasswordMailController };