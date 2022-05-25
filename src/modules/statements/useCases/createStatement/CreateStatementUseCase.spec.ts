import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be able to create a new statement", async () => {
    const userTest = {
      name: "Nome teste",
      email: "teste@example.com",
      password: "1234"
    }

    const user = await userRepositoryInMemory.create(userTest);

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Teste de deposito monetário.",
    });

    expect(statementOperation).toHaveProperty("user_id");
    expect(statementOperation).toHaveProperty("amount");
  })

  it("Should be not able to create a statement if non-existing user", async () => {
    expect( async () => {
      await createStatementUseCase.execute({
        user_id: "Teste_user_id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Teste de deposito monetário.",
      });
    }).rejects.toBeInstanceOf(CreateStatementError);
  });

  it("Should be not able to withdraw an amount if don't enough balance", () => {

    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      const user = await userRepositoryInMemory.create(userTest);

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Teste de deposito monetário.",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "Teste de deposito monetário.",
      });

    }).rejects.toBeInstanceOf(CreateStatementError);
  });
});
