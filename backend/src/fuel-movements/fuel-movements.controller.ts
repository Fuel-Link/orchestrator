import { Controller, Get, HttpStatus, Query, Post, Body, Req, Headers, Delete } from '@nestjs/common';
import { FuelMovementsService } from './fuel-movements.service';
import { AppService } from 'src/app.service';
import * as moment from 'moment';
import { Request } from 'express';

@Controller('fuel-movements')
export class FuelMovementsController {
    res;

    constructor(private readonly movementsservice: FuelMovementsService,private readonly appService: AppService) { }


    
    @Get('')
    async getMovement(@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Get Fuel Movement',
            date: moment().toString(),
            request: request,
            result: null,
            validation: null
        };

        try {
            api.result = await this.movementsservice.findAll();
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
    async postMovement(@Body() movement:{plate:string, liters:string, gaspump_id:number,user_id:number, date:string},@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Post Fuel Movement',
            date: moment().toString(),
            request: movement,
            result: null,
            validation: null
        };

        try {
            api.result = await this.movementsservice.save(movement); 
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
    async deleteMovement(@Query('id') id: string,@Req() request: Request, @Headers() headers: { authorization: string }) {
     
        let api = {
            op: 'Delete Fuel Movement',
            date: moment().toString(),
            request: id,
            result: null,
            validation: null
        };

        try {
            api.result = await this.movementsservice.remove(id);
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
