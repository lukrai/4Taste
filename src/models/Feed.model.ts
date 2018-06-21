import { Document, Schema, Model, model } from "mongoose";

export interface ISource {
    profileName?: string;
    provider?: string;
}

export interface IFeed {
    name?: string;
    sources?: ISource[];
    date_created?: Date;
    date_updated?: Date;
}

export interface IFeedDocument extends IFeed, Document {
    
}

export var FeedSchema: Schema = new Schema({
    name: String,
    sources: [],
    date_created: Date,
    date_updated: Date,
});

export const Feed: Model<IFeedDocument> = model<IFeedDocument>("Feed", FeedSchema);