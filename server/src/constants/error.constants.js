const common = {
  INTERNAL_SERVER: "Opps! Something went wrong",
}

const account = {
  ACCOUNT_CREATION: "Unable to register you!",
}
const job = {}

exports.E = { ...common, ...account, ...job }
