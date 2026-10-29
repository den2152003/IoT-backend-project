import mongoose from "mongoose";

import RefreshTokenSchema, { type IRefreshToken } from "./RefreshTokenSchema";

const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
