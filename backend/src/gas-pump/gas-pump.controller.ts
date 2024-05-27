import { Controller, Get, HttpStatus, Query, Post, Body, Req, Headers, Delete } from '@nestjs/common';
import { GasPumpService } from './gas-pump.service';
import { AppService } from 'src/app.service';
import moment from 'moment';
import { Request } from 'express';

@Controller('gas-pump')
export class GasPumpController {
    res;

    constructor(private readonly gaspumpservice: GasPumpService,private readonly appService: AppService) { }

    
    
    @Get('')
    async getGasPump(@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Get Gas Pump',
            date: moment().toString(),
            request: request,
            result: null,
            validation: null
        };

        try {
            api.result = await this.gaspumpservice.findAll();
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
    async postGasPump(@Body() gasPump:{fuel:string, stock:number, capacity:number, thingId:string},@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Post Gas Pump',
            date: moment().toString(),
            request: gasPump,
            result: null,
            validation: null
        };

        try {
            api.result = await this.gaspumpservice.save(gasPump); 
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
    async deleteGasPump(@Query('id') id: string,@Req() request: Request, @Headers() headers: { authorization: string }) {
     
        let api = {
            op: 'Delete Gas Pump',
            date: moment().toString(),
            request: id,
            result: null,
            validation: null
        };

        try {
            api.result = await this.gaspumpservice.remove(id);
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
