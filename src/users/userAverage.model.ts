
export class AllAverage {

    mostUsedDevice: string;
    mostUsedBrowser: string;
    mostPopularLocation: string;
    mostPopularReffer: string;
    averageTimeOnPages: number;
    avCartAction: string;
    avItemBuy: number;
    mostlyLogged: boolean;
}

export class UserAverage extends AllAverage {

    userId: string;
    userIp: string;
}
