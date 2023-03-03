import { Account } from "./Account";

export interface Job {
    _id: String,
    _account: Account,
    description?: String,
    createdAt: Date,
    updatedAt: Date,
    hours: Number,
    status: String,
    endAt: Date,
    proofOfWork: {
        before: String,
        after: String
    },
    votes: {
        up?: [Account],
        down?: [Account],
        flag?: [Account]
    },
    coords: {
        latitude: String,
        longitude: String
    },
    address: String,
    comments: [{
        comment: String,
        createdBy: String,
        createdAt: Date,
        updatedAt: Date,
    }]
}