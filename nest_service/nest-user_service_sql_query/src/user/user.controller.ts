import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('reset_flag')
  async resetFlag() {
    console.time('execution');
    const coutn = await this.userService.resetFlag();
    console.timeEnd('execution')
    return { userWithProblems: coutn };
  }
}
