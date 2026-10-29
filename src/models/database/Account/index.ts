import mongoose from "mongoose";
import AccountSchema, { type IAccount } from "./AccountSchema";

const Account = mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
