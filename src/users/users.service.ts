import { Injectable, NotFoundException } from '@nestjs/common';
import { UserAll } from './userAll.model';
import { UserAverage } from './userAverage.model';
import { InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../session/session.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('Session')
    private readonly sessionModel: Model<Session>) {}

    //pobierz wszystkich użytkowników i wszystkie aktywności
    //get unique users list na podstawie tego robię listę getUser i zwracam
    async getAllUsers() {

    }

    //pobierz wszystkich użytkowników i średnie aktywności
    async getAvAllUsers() {

    }

    async getUser(userId: string) {
        const userAll = new UserAll();
        let sessions;
        let pages: [ { name: string, timeOn: number } ];
        let buyedItems: [ { itemName: string, itemQuantity: number} ];
        let noSortDevices: string[], noSortBrowsers: string[], noSortLocations: string[], noSortReffers: string[]; 
        
        try { sessions = this.sessionModel.find( { userId: userId } ).exec(); }
        catch(error) { throw new NotFoundException('User not found!') };
        
        sessions.then( (sessionsArr) => {
            userAll.visits = sessionsArr.length;
            sessionsArr.forEach((session) => {
                userAll.sessionIds.push(session.sessionId);
                userAll.visitDates.push(session.visitDate);
                noSortDevices.push(session.device);
                noSortBrowsers.push(session.browser);
                noSortLocations.push(session.location);
                noSortReffers.push(session.reffer);
                session.pages.forEach( (page) => pages.push(page));
                session.cartItems.forEach( (cartItem) => userAll.cartItems.push(cartItem) );
                session.buyedItems.forEach( (buyedItem) => buyedItems.push(buyedItem));
                if (session.didLogged === true) userAll.loggedCounter = userAll.loggedCounter++;
                if (session.didContacted === true) userAll.contactCounter = userAll.contactCounter++;
            });
        });
        userAll.devices = this.removeDuplicates(noSortDevices);
        userAll.browsers = this.removeDuplicates(noSortBrowsers);
        userAll.locations = this.removeDuplicates(noSortLocations);
        userAll.reffers = this.removeDuplicates(noSortReffers);
        this.sumTimeOnPages(pages).forEach((sumPage) => { userAll.pages.push(sumPage); });
        this.sumBuyedItems(buyedItems).forEach((sumItem) => { userAll.buyedItems.push(sumItem); });
        
        return userAll;
    }
    //pobierz średnie aktywności dla jednego usera
    async getAvUser(userId: string) {

    }
    //
    private sumTimeOnPages( pages: [{ name: string, timeOn: number }]) {
        // eslint-disable-next-line prefer-const
        let uniquePagesList = this.getUniquePages(pages);
        pages.forEach((page) => {
            for(let i = 0; i < uniquePagesList.length; i++) {
                if(uniquePagesList[i].name === page.name) 
                    uniquePagesList[i].timeOn = uniquePagesList[i].timeOn + page.timeOn;
            }
        });
        return uniquePagesList;
    }

    private sumBuyedItems(buyedItems: [{ itemName: string, itemQuantity: number }]) {
        // eslint-disable-next-line prefer-const
        let uniqueBuyedItemsList = this.getUniqueBuyedItems(buyedItems);
        buyedItems.forEach((item) => {
            for(let i = 0; i < uniqueBuyedItemsList.length; i++) {
                if(uniqueBuyedItemsList[i].itemName === item.itemName)
                    uniqueBuyedItemsList[i].itemQuantity = uniqueBuyedItemsList[i].itemQuantity + item.itemQuantity;
            }
        });
        return uniqueBuyedItemsList;
    }

    private getUniquePages(pages: [{ name: string, timeOn: number }]) {
        let uniquePagesList: [ { name:string, timeOn: number }];
        const pagesWithDubs: string[] = [];
        pages.forEach((page) => {
            pagesWithDubs.push(page.name);
        });
        const uniquePages = new Set(pagesWithDubs);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const uniquePagesArray = [...uniquePages]
            .forEach((pageName) => {
                uniquePagesList.push({ name: pageName, timeOn: 0 });
        });
        return uniquePagesList;

    }

    private getUniqueBuyedItems(buyedItems: [{ itemName: string, itemQuantity: number }]) {
        let uniqueBuyedItemsList: [{ itemName: string, itemQuantity: number }];
        const itemsWithDubs: string[] = [];
        buyedItems.forEach((item) => {
            itemsWithDubs.push(item.itemName);
        });
        const uniqueBuyedItems = new Set(itemsWithDubs);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const uniqueBuyedItemsArray = [...uniqueBuyedItems]
            .forEach((itemName) => {
                uniqueBuyedItemsList.push({ itemName: itemName, itemQuantity: 0 });
            });
        return uniqueBuyedItemsList;
    };

    private removeDuplicates(array: string[]) {
        let arraySorted: string[] = [];
        const uniquesArray = new Set(array);
        arraySorted = [...uniquesArray];
        return arraySorted;
    }

    private async getUsersList() {

        let usersList: string[] = [];
        const sessions = await this.sessionModel.find().exec();
        sessions.map((ss) => { usersList.push(ss.userId); });
        const uniqueUsers = new Set(usersList);
        usersList = [...uniqueUsers];
        return usersList;
    }
}