import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource
  ) {}

  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async createUsersBatch(usersData: Partial<User>[]): Promise<void> {
    await this.userRepository.save(usersData);
  }

  async resetFlag(): Promise<number> {
    let count = 0;
    await this.dataSource.transaction(async (manager) => {
      const result = await manager.query(
        `SELECT COUNT(*)::int AS count FROM users WHERE "problem" = true;`
      );

      count = result[0]?.count || 0;

      await manager.query(
        `UPDATE users SET "problem" = false WHERE "problem" = true;`
      );
    });

    return count;
  }
}
