import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Session } from '../Models/session.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionsService {
    constructor(@InjectModel('Session')
    private readonly sessionModel: Model<Session>) {}

    async insertSession(
        sessionId: string, 
        userIp: string,
        visitDate: string, 
        device: string, 
        browser: string, 
        location: string, 
        reffer: string
        ) {

        let userId: string;
        let visitCounter: number;

        if(sessionId == null ||
            userIp == null ||
            visitDate == null ||
            device == null ||
            browser == null ||
            location == null ||
            reffer == null)
            throw new BadRequestException('Empty body request, missing data');
        
        await this.getUserId(userIp).then(
            id => { userId = id as string; }
        );
        await this.getVisitCounter(userIp).then(
            counter => { visitCounter = counter as number; }
        );
        
        const newSession: Session = new this.sessionModel({
            userId: userId,
            sessionId: sessionId,
            userIp: userIp,
            visitCounter: visitCounter,
            visitDate: visitDate,
            device: device,
            browser: browser,
            location: location,
            reffer: reffer,
            pages: [],
            cartItems: [],
            buyedItems: [],
            didLogged: false,
            didContacted: false,
        });

        newSession.visitCounter = visitCounter;

        const result = await newSession.save();
        return result.sessionId;
    };

    async getAllSessions() {
        const sessions: Session[] = await this.sessionModel.find().lean();
        return sessions.map((ss) => ({
            userId: ss.userId,
            sessionId: ss.sessionId,
            userIp: ss.userIp,
            visitsCounter: ss.visitCounter,
            visitDate: ss.visitDate,
            device: ss.device,
            browser: ss.browser,
            location: ss.location,
            reffer: ss.reffer,
            pages: ss.pages,
            cartItems: ss.cartItems,
            buyedItems: ss.buyedItems,
            didLogged: ss.didLogged,
            didContacted: ss.didContacted,           
        }))
    };

    async getSingleSession(sessionId: string) {
        const ss: Session = await this.findSession(sessionId);
        return {
            userId: ss.userId,
            sessionId: ss.sessionId,
            userIp: ss.userIp,
            visitsCounter: ss.visitCounter,
            visitDate: ss.visitDate,
            device: ss.device,
            browser: ss.browser,
            location: ss.location,
            reffer: ss.reffer,
            pages: ss.pages,
            cartItems: ss.cartItems,
            buyedItems: ss.buyedItems,
            didLogged: ss.didLogged,
            didContacted: ss.didContacted  
        }
    };

    async getAllUserSessions(userId: string) {
        let sessions: Session[];
        try { sessions = await this.sessionModel.find({ userId: userId }) }
        catch(error) { throw new NotFoundException('User id not found'); }
        if (sessions.length === 0) throw new NotFoundException('Could not find session');
        return sessions.map((ss) => ({
            userId: ss.userId,
            sessionId: ss.sessionId,
            userIp: ss.userIp,
            visitsCounter: ss.visitCounter,
            visitDate: ss.visitDate,
            device: ss.device,
            browser: ss.browser,
            location: ss.location,
            reffer: ss.reffer,
            pages: ss.pages,
            cartItems: ss.cartItems,
            buyedItems: ss.buyedItems,
            didLogged: ss.didLogged,
            didContacted: ss.didContacted,           
        }));
    };

    async updateSession(
        userId: string,
        sessionId: string,
        userIp: string,
        visitCounter: number,
        visitDate: string,
        device: string,
        browser: string,
        location: string,
        reffer: string,
        pages: [{ name: string, timeOn: number}],
        cartItems: [{ itemName: string, itemAction: string }],
        buyedItems: [{ itemName: string, itemQuantity: number }],
        didLogged: boolean,
        didContacted: boolean,
    ) {
        const updatedSession: Session = await this.findSession(sessionId);
        if(userId) updatedSession.userId = userId;
        if(userIp) updatedSession.userIp = userIp;
        if(visitCounter) updatedSession.visitCounter = visitCounter;
        if(visitDate) updatedSession.visitDate = visitDate;
        if(device) updatedSession.device = device;
        if(browser) updatedSession.browser = browser;
        if(location) updatedSession.location = location;
        if(reffer) updatedSession.reffer = reffer;
        
        if(!(pages == null))
            for(let i = 0; i < pages.length; i++)
                if(pages[i]) updatedSession.pages[i] = pages[i];
        
        if(!(cartItems == null))
        for(let i = 0; i < cartItems.length; i++)
            if(cartItems[i]) updatedSession.cartItems[i] = cartItems[i];

        if(!(buyedItems == null))
            for(let i = 0; i < buyedItems.length; i++)
                if(buyedItems[i]) updatedSession.buyedItems[i] = buyedItems[i];

        if(didLogged) updatedSession.didLogged = didLogged;
        if(didContacted) updatedSession.didContacted = didContacted;

        updatedSession.save();

    };

    async addSessionPages(sessionId: string, page: {name: string, timeOn: number}) {
        const session: Session = await this.findSession(sessionId);
        if(page.timeOn < 0) throw new BadRequestException('Time on page must be higher than 0');
        if(typeof page.timeOn !== "number") throw new BadRequestException('Time on page incorrect format');
        if(typeof page.name !== 'string') throw new BadRequestException('Incorrect page name format');
        session.pages.push(page);

        session.save();
    };

    async addSessionCartItems(sessionId: string, cartItems: {itemName: string, itemAction: string}) {
        const session: Session = await this.findSession(sessionId);
        if(typeof sessionId !== 'string') throw new BadRequestException('Bad session id format');
        if(cartItems.itemAction !== "Add" && cartItems.itemAction !== "Remove") throw new BadRequestException('Item action must be Add or Remove');
        if(typeof cartItems.itemName !== 'string') throw new BadRequestException('Incorrect item name format');
        session.cartItems.push(cartItems);

        session.save();
    };

    async addSessionBuyedItems(sessionId: string, buyedItems: { itemName: string, itemQuantity: number}) {
        const session: Session = await this.findSession(sessionId);
        if(buyedItems.itemQuantity <= 0) throw new BadRequestException('Item quantity must be higher than 0');
        if(typeof buyedItems.itemQuantity !== "number") throw new BadRequestException('Item quantity incorrect format');
        if(typeof buyedItems.itemName !== 'string') throw new BadRequestException('Incorrect item name format');
        session.buyedItems.push(buyedItems);

        session.save();
    };

    async updateSessionLogged(sessionId: string, status: boolean) {
        const session: Session = await this.findSession(sessionId);
        if(typeof sessionId !== 'string') throw new BadRequestException('Incorrect sessiond Id format');
        if(typeof status !== 'boolean') throw new BadRequestException('Incorrect statis format');
        session.didLogged = status;

        session.save();
    };

    async updateSessionContacted(sessionId: string, status: boolean) {
        const session: Session = await this.findSession(sessionId);
        if(typeof status !== 'boolean') throw new BadRequestException('Incorrect format');
        session.didContacted = status;

        session.save();
    };

    async deleteSession(sessionId: string) {
        const result = await this.sessionModel.deleteOne({ sessionId: sessionId }).exec();
        if (result.n === 0) throw new NotFoundException('Could not find session');
    };

    
    private async findSession(sessionId: string): Promise<Session> {
        let session: Session;
        try { session = await this.sessionModel.findOne({ sessionId: sessionId }) }
        catch(error) { throw new NotFoundException('Could not find session') }
        if (!session) throw new NotFoundException('Could not find session');
        return session;
    };
    
    private async getUserId(usIp: string): Promise<string> {
         const session: Session = await this.sessionModel.findOne( { userIp: usIp });
        if (!session) return '_' + Math.random().toString(36).substr(2, 9);
        else return session.userId as string;
    };

    private async getVisitCounter(usIp: string): Promise<number> {
        const sessions: Session[] = await this.sessionModel.find({ userIp: usIp });
        return sessions.length + 1 as number;
    };
}