
export class UserAll {
    userId: string;
    sessionIds: string[];
    visits: number;
    visitDates: string[];
    devices: string[];
    browsers: string[];
    locations: string[];
    reffers: string[];
    pages: [
        {
            name: string,
            timeOn: number
        }
    ];
    cartItems: [
        {
            itemName: string,
            itemAction: string,
        }
    ];
    buyedItems: [
        {
            itemName: string,
            itemQuantity: number
        }
    ];
    loggedCounter: number;
    contactCounter: number;
}
