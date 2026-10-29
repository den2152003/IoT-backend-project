import Counter from "@/models/database/Counter";

export const getNextSequence = async (name: string): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    { name },
    {
      $inc: {
        seq: 1
      }
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  if (!counter) {
    throw new Error("Không thể tạo số thứ tự");
  }

  return counter.seq;
};
