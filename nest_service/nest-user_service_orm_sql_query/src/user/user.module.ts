import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMigrationService } from './user.migration';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UserService, UserMigrationService],
    controllers: [UserController],
    
})
export class UserModule {}
