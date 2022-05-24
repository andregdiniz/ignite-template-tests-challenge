import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const userTest = {
      name: "Nome teste",
      email: "teste@example.com",
      password: "1234"
    }

    const user = await createUserUseCase.execute(userTest);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
  });

  it("Should not be able to create a new user if it already exists", async () => {
    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      const userTest1 = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "12345"
      }

      await createUserUseCase.execute(userTest);
      await createUserUseCase.execute(userTest1);

    }).rejects.toBeInstanceOf(CreateUserError);
  });

})
