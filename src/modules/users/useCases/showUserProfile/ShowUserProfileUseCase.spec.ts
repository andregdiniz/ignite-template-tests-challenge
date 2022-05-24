import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  });

  it("Should be able to show an user profile", async () => {
    const userTest = {
      name: "Nome teste",
      email: "teste@example.com",
      password: "1234"
    }

    const { id } = await createUserUseCase.execute(userTest);

    const userProfile = await showUserProfileUseCase.execute(id);

    expect(userProfile).toHaveProperty("email");
  });

  it("Should not be able to show an non-existing user profile", async () => {
    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      createUserUseCase.execute(userTest);

      await showUserProfileUseCase.execute(
        "id_test"
      );

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
