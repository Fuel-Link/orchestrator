import { Controller, Get, HttpStatus, Query, Post, Body, Req, Headers, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppService } from 'src/app.service';
import * as moment from 'moment';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    res;

    constructor(private readonly userservice: UsersService,private readonly appService: AppService) { }

    
    @Get('')
    async getUser(@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Get User',
            date: moment().toString(),
            request: request,
            result: null,
            validation: null
        };

        try {
            api.result = await this.userservice.findAll();
            if (api.result !== null) {
                this.res = this.appService.handleResponse(true, 'Done! ✔️', HttpStatus.OK, api);
            } else {
                this.res = this.appService.handleResponse(false, 'Server error! ❌️', HttpStatus.INTERNAL_SERVER_ERROR, api);
            }
        } catch (error) {
            api.validation = null;
            api.result = error;
            this.res = this.appService.handleResponse(false, 'Server error! ❌️', HttpStatus.INTERNAL_SERVER_ERROR, api);
        }
        return this.res;
 
    }


    

    @Post()
    async postUser(@Body() user:{username:string, role:string, hash:string},@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Post User',
            date: moment().toString(),
            request: user,
            result: null,
            validation: null
        };

        try {
            api.result = await this.userservice.save(user); 
            if (api.result !== null) {
                this.res = this.appService.handleResponse(true, 'Done! ✔️', HttpStatus.OK, api);
            } else {
                this.res = this.appService.handleResponse(false, 'Server error! ❌️', HttpStatus.INTERNAL_SERVER_ERROR, api);
            }
        } catch (error) {
            api.validation = null;
            api.result = error;
            this.res = this.appService.handleResponse(false, 'Server error! ❌️', HttpStatus.INTERNAL_SERVER_ERROR, api);
        }
        return this.res;

    }



    @Delete()
    async deleteUser(@Query('id') id: string,@Req() request: Request, @Headers() headers: { authorization: string }) {
     
        let api = {
            op: 'Delete User',
            date: moment().toString(),
            request: id,
            result: null,
            validation: null
        };

        try {
            api.result = await this.userservice.remove(id);
            if (api.result !== null) {
                this.res = this.appService.handleResponse(true, 'Done! ✔️', HttpStatus.OK, api);
            } else {
                this.res = this.appService.handleResponse(false, 'Server error! ❌️', HttpStatus.INTERNAL_SERVER_ERROR, api);
            }
        } catch (error) {
            api.validation = null;
            api.result = error;
            this.res = this.appService.handleResponse(false, 'Server error! ❌️', HttpStatus.INTERNAL_SERVER_ERROR, api);
        }
        return this.res;
        
    }
}
