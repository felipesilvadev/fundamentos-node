import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalance(type: string): number {
    return this.transactions
      .filter(transaction => transaction.type === type)
      .reduce((result, item) => result + item.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance('income');
    const outcome = this.calculateBalance('outcome');
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();
    if (type === 'outcome' && value > total) {
      throw Error('Cannot create outcome transaction without a valid balance');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
