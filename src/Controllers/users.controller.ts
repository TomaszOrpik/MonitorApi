import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../Services/users.service';

@Controller('users')
export class UsersController {
    //add empty data exception
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers() {
        const users = await this.usersService.getAllUsers();
        return users;
    };

    @Get(':id')
    getUser(@Param('id') userId: string) { return this.usersService.getUser(userId); };

    @Get('all/average')
    async getAllAverage() {
        const avUsers = await this.usersService.getAvAllUsers();
        return avUsers;
    };

    @Get('average/:id')
    getAvUser(@Param('id') userId: string) { return this.usersService.getAvUser(userId) };
}