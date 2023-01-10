import { AppError } from "@errors/AppError";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/providers/MailProvider.ts/in-memory/MailProviderInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      id: "1254521778",
      driver_license: "053435",
      email: "rukub@cuvaime.vc",
      name: "Samuel Gilbert",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("rukub@cuvaime.vc");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send an email if user does not exists", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("nujora@we.me")
    ).rejects.toEqual(new AppError("User does not exists!"));
  });

  it("should be able to create an users token", async () => {
    const genereteTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create");

    usersRepositoryInMemory.create({
      id: "1254521778",
      driver_license: "053435",
      email: "rukub@cuvaime.vc",
      name: "Samuel Gilbert",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("rukub@cuvaime.vc");

    expect(genereteTokenMail).toBeCalled();
  })

});