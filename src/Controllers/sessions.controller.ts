import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { SessionsService } from '../Services/sessions.service';
import { SessionDto } from 'src/Models/session.dto';
import { fullSessionDto } from 'src/Models/fullSession.dto';
import { Page } from 'src/Models/page.dto';
import { CartItem } from 'src/Models/cartItem.dto';
import { BuyedItem } from 'src/Models/buyedItem.dto';
import { SessionScrap } from 'src/Models/sessionScrap.dto';

@Controller('sessions')
export class SessionsController {

    constructor(private readonly sessionsService: SessionsService) {}

    @Post()
    async insertSession(
        @Body() session: SessionDto
    ) {
        const ssId = await this.sessionsService.insertSession(
            session.sessionId,
            session.userIp,
            session.visitDate,
            session.device,
            session.browser,
            session.location,
            session.reffer
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

    @Get('user/:id')
    getUserSessions(@Param('id') userId: string ) { return this.sessionsService.getAllUserSessions(userId); };
    
    @Patch(':id')
    async updateSession(
        @Param('id') sessionId: string,
        @Body() fullSession: fullSessionDto,
    ) {
        await this.sessionsService.updateSession(
            fullSession.userId, 
            sessionId, 
            fullSession.userIp, 
            fullSession.visitCounter,
            fullSession.visitDate, 
            fullSession.device, 
            fullSession.browser, 
            fullSession.location, 
            fullSession.reffer, 
            fullSession.pages, 
            fullSession.cartItems, 
            fullSession.buyedItems, 
            fullSession.didLogged, 
            fullSession.didContacted,
            fullSession.sessionScrap
        )
        return null;
    };

    @Patch('pages/:id')
    async addSessionPages(
        @Param('id') sessionId: string,
        @Body() page: Page,
    ) {
        await this.sessionsService.addSessionPages(sessionId, page );
        return null;
    };

    @Patch('cartitems/:id')
    async addSessionCartItems(
        @Param('id') sessionId: string,
        @Body() cartItem: CartItem
    ) {
        await this.sessionsService.addSessionCartItems(sessionId,cartItem);
        return null;
    };

    @Patch('buyeditems/:id')
    async addSessionBuyedItems(
        @Param('id') sessionId: string,
        @Body() buyedItem: BuyedItem
    ) {
        await this.sessionsService.addSessionBuyedItems(sessionId, buyedItem);
        return null;
    };

    @Patch('sessionscraps/:id')
    async addSessionScrap(
        @Param('id') sessionId: string,
        @Body() sessionScrap: SessionScrap
    ) {
        await this.sessionsService.addSessionScrap(sessionId, sessionScrap);
        return null;
    }

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