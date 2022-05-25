import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance account", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      userRepositoryInMemory
    );
  });

  it("Should be able to get a user's balance", async () => {
    const userTest = {
      name: "Nome teste",
      email: "teste@example.com",
      password: "1234"
    }

    const user = await createUserUseCase.execute(userTest);

    await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Teste de deposito monetário.",
    });

    const balanceUser = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balanceUser).toHaveProperty("balance");
  });

  it("Should not be able to get a balance if non-existing user", async () => {
    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      const user = await createUserUseCase.execute(userTest);

      await statementRepositoryInMemory.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Teste de deposito monetário.",
      });

      await getBalanceUseCase.execute({
        user_id: "user_id" as string,
      });

    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
