import { SessionDto } from "./session.dto";

export interface fullSessionDto extends SessionDto {
    userId: string;
    visitCounter: number;
    pages: [{ name: string, timeOn: number }];
    cartItems: [{ itemName: string, itemAction: string }];
    buyedItems: [{ itemName: string, itemQuantity: number }];
    didLogged: boolean;
    didContacted: boolean;
    sessionScrap: [
        {
            windowWidth: number,
            windowHeigth: number,
            currentPage: string,
            scrollTopPosition: number,
            mouseX: number,
            mouseY: number,
            clickedItemId: string
        }
    ];
}
