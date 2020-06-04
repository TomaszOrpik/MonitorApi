
export class UserAverage {
    userId: string;
    userIp: string;
    mostUsedDevice: string;
    mostUsedBrowser: string;
    mostPopularLocation: string;
    mostPopularReffer: string;
    averageTimeOnPages: [
        {
            name: string,
            averangeTime: number
        }
    ];
    mostFrequentlyAddedItem: [
        {
            name: string,
            frequency: number
        }
    ];
    mostFrequentlyBuyedItem: [
        {
            name: string,
            quantity: number
        }
    ];
    mostlyLogged: boolean;
}
