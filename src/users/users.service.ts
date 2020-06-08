import { Injectable, NotFoundException } from '@nestjs/common';
import { UserAll } from './userAll.model';
import { UserAverage, AllAverage } from './userAverage.model';
import { InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../session/session.model';
import { SessionsService } from '../session/sessions.service';

@Injectable()
export class UsersService {
    constructor(@InjectModel('Session')
    private readonly sessionModel: Model<Session>,
    private readonly sessionsService: SessionsService) {}

    async getAllUsers() {
        const users: UserAll[] = [];
        await this.getUsersList().then((usersId) => {
            usersId.forEach((userId) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const user = this.getUser(userId).then(userid => {
                    users.push(userid);
                })
            });
        });
        return users;
    }

    async getAvAllUsers() {
        const allAverage = new AllAverage();
        const mostUsedDevices: string[] = [];
        const mostUsedBrowsers: string[] = [];
        const mostPopularLocations: string[] = [];
        const mostPopularReffers: string[] = [];
        const averageTimeOnPages: number[] = [];
        const avCartActions: string[] = [];
        const avItemBuys: number[] = [];
        const mostlyLoggeds: boolean[] = [];

        const users = this.getUsersList();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = (await users).forEach((user) => {
            const userData = this.getAvUser(user);
            userData.then((data: UserAverage) => {
                mostUsedDevices.push(data.mostUsedDevice);
                mostUsedBrowsers.push(data.mostUsedBrowser);
                mostPopularLocations.push(data.mostPopularLocation);
                mostPopularReffers.push(data.mostPopularReffer);
                averageTimeOnPages.push(data.averageTimeOnPages);
                avCartActions.push(data.avCartAction);
                avItemBuys.push(data.avItemBuy);
                mostlyLoggeds.push(data.mostlyLogged);
            });
        });
        allAverage.mostUsedDevice = this.getMostPopular(mostUsedDevices);
        allAverage.mostUsedBrowser = this.getMostPopular(mostUsedBrowsers);
        allAverage.mostPopularLocation = this.getMostPopular(mostPopularLocations);
        allAverage.mostPopularReffer = this.getMostPopular(mostPopularReffers);
        allAverage.averageTimeOnPages = this.getAverage(averageTimeOnPages);
        allAverage.avCartAction = this.getMostPopular(avCartActions);
        allAverage.avItemBuy = this.getAverage(avItemBuys);
        allAverage.mostlyLogged = this.getMostPopular(mostlyLoggeds);

        return allAverage;
    };

    async getUser(userId: string) {
        const userAll = new UserAll();
        const pages: {name: string, timeOn: number}[] = [];
        const buyedItems: { itemName: string, itemQuantity: number}[] = [];
        const cartItems: { itemName: string, itemAction: string}[] = [];
        const sessionIds: string[] = [];
        const visitDates: string[] = [];
        const noSortDevices: string[] = [], noSortBrowsers: string[] = [], noSortLocations: string[] = [], noSortReffers: string[] = []; 
        

        const sessions = await this.sessionsService.getAllUserSessions(userId);


        sessions.forEach((session) => {
            sessionIds.push(session.sessionId.toString());
            visitDates.push(session.visitDate);
            noSortDevices.push(session.device);
            noSortBrowsers.push(session.browser);
            noSortLocations.push(session.location);
            noSortReffers.push(session.reffer);
            session.pages.forEach((page) => pages.push(page));
            session.cartItems.forEach((cartItem) => cartItems.push(cartItem));
            session.buyedItems.forEach((buyedItem) => buyedItems.push(buyedItem));
        });
        userAll.visits = sessions.length;
        userAll.sessionIds = sessionIds;
        userAll.visitDates = visitDates;
        userAll.devices = this.removeDuplicates(noSortDevices);
        userAll.browsers = this.removeDuplicates(noSortBrowsers);
        userAll.locations = this.removeDuplicates(noSortLocations);
        userAll.reffers = this.removeDuplicates(noSortReffers);
        if(!(pages == null)) {
            const sumPages: { name: string, timeOn: number}[] = this.sumTimeOnPages(pages);
            userAll.pages = sumPages;
        };
        if(!(cartItems == null))
            userAll.cartItems = cartItems;
        if(!(buyedItems == null)) {
            const sumBuyedItems = this.sumBuyedItems(buyedItems);
            userAll.buyedItems = sumBuyedItems;
        };

        return userAll;

    };

    async getAvUser(userId: string) {
        const userAverage = new UserAverage();
        let sessions: Promise<Session[]>;
        let ips: string[],devices: string[], browsers: string[], locations: string[], reffers: string[], loggeds: boolean[];
        let timeOnPages: number[], cartActions: string[], buyedItemsCount: number[];

        try { sessions = this.sessionModel.find( { userId: userId } ).exec(); }
        catch(error) { throw new NotFoundException('User not found!') };
        sessions.then((sessionsArr) => {
            sessionsArr.forEach((session) => {
                ips.push(session.userIp);
                devices.push(session.device);
                browsers.push(session.browser);
                locations.push(session.location);
                reffers.push(session.reffer);
                session.pages.forEach((page) => { timeOnPages.push(page.timeOn); });
                session.cartItems.forEach((cartItem) => { cartActions.push(cartItem.itemAction); });
                session.buyedItems.forEach((buyedItem) => { buyedItemsCount.push(buyedItem.itemQuantity); });
                loggeds.push(session.didLogged);
            });
        });
        userAverage.userId = userId;
        userAverage.userIp = this.getMostPopular(ips);
        userAverage.mostUsedDevice = this.getMostPopular(devices);
        userAverage.mostUsedBrowser = this.getMostPopular(browsers);
        userAverage.mostPopularLocation = this.getMostPopular(locations);
        userAverage.mostPopularReffer = this.getMostPopular(reffers);
        userAverage.averageTimeOnPages = this.getAverage(timeOnPages);
        userAverage.avCartAction = this.getMostPopular(cartActions);
        userAverage.avItemBuy = this.getAverage(buyedItemsCount);
        userAverage.mostlyLogged = this.getMostPopular(loggeds);

        return userAverage;
    };

    private getMostPopular(array): any {
        let mf = 1, m = 0, item: string|number|boolean;
        for(let i = 0; i < array.length; i++) {
            for(let j = i; j < array.length; j++) {
                if (array[i] === array[j]) m++;
                if (mf < m) {
                    mf = m;
                    item = array[i];
                };
            };
        };
        return item;
    };

    private sumTimeOnPages( pages: { name: string, timeOn: number }[]) {
        // eslint-disable-next-line prefer-const
        let uniquePagesList = this.getUniquePages(pages);
        if(!(pages == null))
            pages.forEach((page) => {
                for(let i = 0; i < uniquePagesList.length; i++) {
                    if(uniquePagesList[i].name === page.name) 
                        uniquePagesList[i].timeOn = uniquePagesList[i].timeOn + page.timeOn;
                }
            });
        return uniquePagesList;
    };

    private sumBuyedItems(buyedItems:{ itemName: string, itemQuantity: number }[]) {
        // eslint-disable-next-line prefer-const
        let uniqueBuyedItemsList = this.getUniqueBuyedItems(buyedItems);
        if(!(buyedItems == null))
            buyedItems.forEach((item) => {
                for(let i = 0; i < uniqueBuyedItemsList.length; i++) {
                    if(uniqueBuyedItemsList[i].itemName === item.itemName)
                        uniqueBuyedItemsList[i].itemQuantity = uniqueBuyedItemsList[i].itemQuantity + item.itemQuantity;
                }
            });
        return uniqueBuyedItemsList;
    };

    private getUniquePages(pages: { name: string, timeOn: number }[]) {
        const uniquePagesList: { name:string, timeOn: number }[] = [];
        const pagesWithDubs: string[] = [];
        if(!(pages == null))
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

    };

    private getUniqueBuyedItems(buyedItems: { itemName: string, itemQuantity: number }[]) {
        const uniqueBuyedItemsList: { itemName: string, itemQuantity: number }[] = [];
        const itemsWithDubs: string[] = [];
        if(!(buyedItems == null))
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
    };

    private getAverage(array): number { return (this.getSum(array) / array.length) || 0; };

    private getSum(array): number { return array.reduce((a, b) => a + b, 0); };

    private async getUsersList() {

        let usersList: string[] = [];
        const sessions = await this.sessionModel.find().exec();
        sessions.map((ss) => { usersList.push(ss.userId); });
        const uniqueUsers = new Set(usersList);
        usersList = [...uniqueUsers];
        return usersList;
    };
}