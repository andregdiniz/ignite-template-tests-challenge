import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be able to list a user's statement operation", async () => {
    const userTest = {
      name: "Nome teste",
      email: "teste@example.com",
      password: "1234"
    }

    const user = await userRepositoryInMemory.create(userTest);

    const statement = await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Teste de deposito monetário.",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("type");

  });

  it("Should not be able to list statement operation if user doesn't exists", () => {
    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      const user = await userRepositoryInMemory.create(userTest);

      const statement = await statementRepositoryInMemory.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Teste de deposito monetário.",
      });

      await getStatementOperationUseCase.execute({
        user_id: "id_user_test",
        statement_id: statement.id
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });

  it("Should not be able to list statement operation if statement doesn't exists", () => {
    expect( async () => {
      const userTest = {
        name: "Nome teste",
        email: "teste@example.com",
        password: "1234"
      }

      const user = await userRepositoryInMemory.create(userTest);

      const statement = await statementRepositoryInMemory.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Teste de deposito monetário.",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "id_statement_test"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });

});
