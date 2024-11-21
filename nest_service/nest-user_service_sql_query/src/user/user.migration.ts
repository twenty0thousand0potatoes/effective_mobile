import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserMigrationService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}
  async onModuleInit() {
    const userCountDBCurrent = await this.userService.countUsers();

    if (userCountDBCurrent > 0) {
      console.log(`Skipping migration: ${userCountDBCurrent} users already exist.`);
      return;
    }

    const batchSize = 1000;
    const usersBatch = [];
    const userCount = 1_000_000;

    for (let i = 0; i < userCount; i++) {
      usersBatch.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: Math.floor(Math.random() * 100),
        gender: faker.person.sex(),
        problem: faker.datatype.boolean(),
      });

      if (usersBatch.length === batchSize || i === userCount - 1) {
        await this.userService.createUsersBatch(usersBatch);
        usersBatch.length = 0;
      }
    }
  }
}
