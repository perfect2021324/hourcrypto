

export interface JobTodo {
    _id?: String,
    type: String,
    userId: String
    cryptoAddress: String,
    jobId: String,
    description: String,
    createdAt: Date,
    updatedAt: Date,
    volunteers?: Number,
    status: String,
    current: String,
    votes: {
        up: Number,
        down: Number,
        flag: Number
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