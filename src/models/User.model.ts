import { Document, Schema, Model, model } from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
    provider: "local" | "google" | "facebook";

    comparePassword(password: string): boolean;
}

// export interface IUserModel extends IUser {
//     comparePassword(password: string): boolean; 
// }

export const UserSchema: Schema = new Schema({


    firstName: String,
    lastName: String,
    provider: { type: String, enum: ["local", "google", "facebook"], required: true },
    local: {
        email: { type: String, lowercase: true },
        password: { type: String },
    },
    google: {
        id: { type: String },
        email: { type: String, lowercase: true },
    },
    facebook: {
        id: { type: String },
        email: { type: String, lowercase: true },
    },
}, { timestamps: true });

UserSchema.pre('save', async function (this: any, next) {
    try {
        if (this.provider !== "local") {
            next();
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;
    } catch (error) {
        next(error);
    }
});

UserSchema.method('comparePassword', async function (this: any, password: string) {
    try {
        return await bcrypt.compare(password, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
});

export const User: Model<IUser> = model<IUser>("User", UserSchema);
