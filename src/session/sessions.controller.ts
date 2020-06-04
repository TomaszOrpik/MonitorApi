import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {

    constructor(private readonly sessionsService: SessionsService) {}

    @Post()
    async insertSession(
        @Body('sessionId') sessionId: string,
        @Body('userIp') userIp: string,
        @Body('visitDate') visitDate: string,
        @Body('device') device: string,
        @Body('browser') browser: string,
        @Body('location') location: string,
        @Body('reffer') reffer: string
    ) {
        const ssId = await this.sessionsService.insertSession(
            sessionId,
            userIp,
            visitDate,
            device,
            browser,
            location,
            reffer
        );
        return ssId;
    };

    @Get()
    async getAllSessions() {
        const sessions = await this.sessionsService.getAllSessions();
        return sessions;
    };

    @Get(':id')
    getSession(@Param('id') sessionId: string) { return this.sessionsService.getSingleSession(sessionId); };

    @Patch(':id')
    async updateSession(
        @Param('id') sessionId: string,
        @Body('userId') userId: string,
        @Body('userIp') userIp: string,
        @Body('visitCounter') visitCounter: number,
        @Body('visitDate') visitDate: string,
        @Body('device') device: string,
        @Body('browser') browser: string,
        @Body('location') location: string,
        @Body('reffer') reffer: string,
        @Body('pages') pages: [{ name: string, timeOn: number}],
        @Body('cartItems') cartItems: [{ itemName: string, itemAction: string }],
        @Body('buyedItems') buyedItems: [{ itemName: string, itemQuantity: number }],
        @Body('didLogged') didLogged: boolean,
        @Body('didContacted') didContacted: boolean     
    ) {
        await this.sessionsService.updateSession(
            userId, 
            sessionId, 
            userIp, 
            visitCounter,
            visitDate, 
            device, 
            browser, 
            location, 
            reffer, 
            pages, 
            cartItems, 
            buyedItems, 
            didLogged, 
            didContacted
        )
        return null;
    };

    @Patch('pages/:id')
    async addSessionPages(
        @Param('id') sessionId: string,
        @Body('name') name: string,
        @Body('timeOn') timeOn: number
    ) {
        await this.sessionsService.addSessionPages(sessionId, { name, timeOn} );
        return null;
    };

    @Patch('cartitems/:id')
    async addSessionCartItems(
        @Param('id') sessionId: string,
        @Body('itemName') itemName: string,
        @Body('itemAction') itemAction: string
    ) {
        await this.sessionsService.addSessionCartItems(sessionId, { itemName, itemAction });
        return null;
    };

    @Patch('buyeditems/:id')
    async addSessionBuyedItems(
        @Param('id') sessionId: string,
        @Body('itemName') itemName: string,
        @Body('itemQuantity') itemQuantity: number
    ) {
        await this.sessionsService.addSessionBuyedItems(sessionId, { itemName, itemQuantity });
        return null;
    };

    @Patch('logged/:id')
    async updateLoggedStatus(
        @Param('id') sessionId: string,
        @Body('isLogged') isLogged: boolean
    ) {
        await this.sessionsService.updateSessionLogged(sessionId, isLogged);
        return null;
    };

    @Patch('contacted/:id')
    async updateContactedStatus(
        @Param('id') sessionId: string,
        @Body('isContacted') isContacted: boolean
    ) {
        await this.sessionsService.updateSessionContacted(sessionId, isContacted);
        return null;
    };

    @Delete(':id')
    async removeSession(@Param('id') sessionId: string) {
        await this.sessionsService.deleteSession(sessionId);
        return null;
    };
}