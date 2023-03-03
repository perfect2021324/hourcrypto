export interface Account {
    _id: String,
    email: String,
    cryptoAddress: String,
    status: String,
    firstName?: String,
    lastName?: String,
    displayName?: String,
    displayPicture?: Buffer
    ssn?: String,
    createdAt: Date,
    updatedAt: Date,
}
export interface AccountDetails extends Account {
    token?: String
    wallet: Number
}