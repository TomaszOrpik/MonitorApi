import * as mongoose from 'mongoose';

const pagesSchema = new mongoose.Schema({
    name: { type: String },
    timeOn: { type: Number},
});

const cartItemsSchema = new mongoose.Schema({
    itemName: { type: String },
    itemAction: { type: String },
});

const buyedItemsSchema = new mongoose.Schema({
    itemName: { type: String },
    itemQuantity: { type: Number },
});

export const SessionSchema = new mongoose.Schema(
{
    userId: { type: String },
    sessionId: { type: String, required: true },
    userIp: { type: String, required: true },
    visitsCounter: { type: Number },
    visitDate: { type: String },
    device: { type: String },
    browser: { type: String },
    location: { type: String },
    reffer: { type: String },
    pages: [ pagesSchema ],
    cartItems: [ cartItemsSchema ],
    buyedItems: [ buyedItemsSchema ],
    didLogged: { type: Boolean },
    didContacted: { type: Boolean },
}
);

export interface Session extends mongoose.Document {
    userId: string,
    sessionId: string,
    userIp: string,
    visitCounter: number,
    visitDate: string,
    device: string,
    browser: string,
    location: string,
    reffer: string,
    pages: [
        {
            name: string,
            timeOn: number
        }],
    cartItems: [
        {
            itemName: string,
            itemAction: string
        }],
    buyedItems: [
        {
            itemName: string,
            itemQuantity: number
        }],
    didLogged: boolean,
    didContacted: boolean
}
