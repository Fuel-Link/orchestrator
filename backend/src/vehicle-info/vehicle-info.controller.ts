import { Controller, Get, HttpStatus, Query, Post, Body, Req, Headers, Delete } from '@nestjs/common';
import { VehicleInfoService } from './vehicle-info.service';
import { AppService } from 'src/app.service';
import * as moment from 'moment';
import { Request } from 'express';

@Controller('vehicle-info')
export class VehicleInfoController {
    res;

    constructor(private readonly vehicleservice: VehicleInfoService,private readonly appService: AppService) { }

    @Get('')
    async getVehicle(@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Get Vehicle',
            date: moment().toString(),
            request: request,
            result: null,
            validation: null
        };

        try {
            api.result = await this.vehicleservice.findAll();
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

    @Get('/plate')
    async getPlate(@Query('plate') plate : string) {
        try{
           return await this.vehicleservice.findVehicle(plate) 
        }catch(e){
            console.log(e)
            return "Get Vehicle failed";
        }   
    }


    @Post()
    async postVehicle(@Body() vehicle:{plate:string, fuel:string, type:string,model:string,brand:string, color:string},@Req() request: Request, @Headers() headers: { authorization: string }) {
    
        let api = {
            op: 'Post Vehicle',
            date: moment().toString(),
            request: vehicle,
            result: null,
            validation: null
        };

        try {
            api.result = await this.vehicleservice.save(vehicle); 
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
    async deleteVehicle(@Query('id') id: string,@Req() request: Request, @Headers() headers: { authorization: string }) {
     
        let api = {
            op: 'Delete Vehicle',
            date: moment().toString(),
            request: id,
            result: null,
            validation: null
        };

        try {
            api.result = await this.vehicleservice.remove(id);
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
