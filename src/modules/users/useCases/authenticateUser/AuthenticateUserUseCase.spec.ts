import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach( () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
  });

  it("Should be able to authenticate user", async () => {

    const userTest = {
      name: "Nome teste",
      email: "teste@example.com",
      password: "1234"
    }

    await createUserUseCase.execute(userTest);

    const authenticateUser = await authenticateUserUseCase.execute({
      email: "teste@example.com",
      password: "1234",
    });

    expect(authenticateUser).toHaveProperty("token");
    expect(authenticateUser.user).toHaveProperty("id");
    expect(authenticateUser.user).toHaveProperty("email");
  });

  it("Should not be able to authenticate a non-existing user", () => {
    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      const user = await createUserUseCase.execute(userTest);

      await authenticateUserUseCase.execute({
        email: "teste1@example.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

  it("Should not be able to authenticate a user with incorrect password", () => {
    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      const user = await createUserUseCase.execute(userTest);

      await authenticateUserUseCase.execute({
        email: "teste@example.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });
});
