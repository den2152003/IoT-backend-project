import mongoose from "mongoose";

import ENV from "@/cores/ENV";

const dbConnect = async (): Promise<void> => {
  await mongoose.connect(ENV.MONGODB_URI);

  console.log("MongoDB connected");
};

export default dbConnect;