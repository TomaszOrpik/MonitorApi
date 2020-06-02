import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from './session.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionsService {
    constructor(@InjectModel('Session') private readonly sessionModel: Model<Session>) {}

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
        
        await this.getUserId(userIp).then(
            id => { userId = id as string; }
        );
        await this.getVisitCounter(userIp).then(
            counter => { visitCounter = counter as number; }
        );
        
        const newSession = new this.sessionModel({
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

        const result = await newSession.save();
        return result.sessionId as string;
    };

    async getAllSessions() {
        const sessions = await this.sessionModel.find().exec();
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
        const ss = await this.findSession(sessionId);
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
        const updatedSession = await this.findSession(sessionId);
        if(userId) updatedSession.userId = userId;
        if(userIp) updatedSession.userIp = userIp;
        if(visitCounter) updatedSession.visitCounter = visitCounter;
        if(visitDate) updatedSession.visitDate = visitDate;
        if(device) updatedSession.device = device;
        if(browser) updatedSession.browser = browser;
        if(location) updatedSession.location = location;
        if(reffer) updatedSession.reffer = reffer;
        
        for(let i = 0; i < pages.length; i++)
            if(pages[i]) updatedSession.pages[i] = pages[i];
        
        for(let i = 0; i < cartItems.length; i++)
            if(cartItems[i]) updatedSession.cartItems[i] = cartItems[i];

        for(let i = 0; i < buyedItems.length; i++)
            if(buyedItems[i]) updatedSession.buyedItems[i] = buyedItems[i];

        if(didLogged) updatedSession.didLogged = didLogged;
        if(didContacted) updatedSession.didContacted = didContacted;

        updatedSession.save();

    };

    async addSessionPages(sessionId: string, page: {name: string, timeOn: number}) {
        const session = await this.findSession(sessionId);
        session.pages.push(page);

        session.save();
    };

    async addSessionCartItems(sessionId: string, cartItems: {itemName: string, itemAction: string}) {
        const session = await this.findSession(sessionId);
        session.cartItems.push(cartItems);

        session.save();
    };

    async addSessionBuyedItems(sessionId: string, buyedItems: { itemName: string, itemQuantity: number}) {
        const session = await this.findSession(sessionId);
        session.buyedItems.push(buyedItems);

        session.save();
    };

    async updateSessionLogged(sessionId: string, status: boolean) {
        const session = await this.findSession(sessionId);
        session.didLogged = status;

        session.save();
    };

    async updateSessionContacted(sessionId: string, status: boolean) {
        const session = await this.findSession(sessionId);
        session.didContacted = status;

        session.save();
    };

    async deleteSession(sessionId: string) {
        const result = await this.sessionModel.deleteOne({ sessionId: sessionId }).exec();
        if (result.n === 0) throw new NotFoundException('Could not find session');
    };

    
    private async findSession(sessionId: string): Promise<Session> {
        let session;
        try { session = await this.sessionModel.findOne({ sessionId: sessionId }) }
        catch(error) { throw new NotFoundException('Could not find session') }
        if (!session) throw new NotFoundException('Could not find session');
        return session;
    };
    
    private async getUserId(usIp: string): Promise<string> {
         const session = await this.sessionModel.findOne( { userIp: usIp });
        if (!session) return '_' + Math.random().toString(36).substr(2, 9);
        else return session.userId as string;
    };

    private async getVisitCounter(usIp: string): Promise<number> {
        const sessions = await this.sessionModel.find({ userIp: usIp });
        return sessions.length as number;
    };
}