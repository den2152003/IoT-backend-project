import multer from "multer";

export const uploadEmployeeExcel = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Tối đa 5 MB
    files: 1
  },
  fileFilter: (_req, file, callback) => {
    const allowedExtensions = [".xlsx", ".xls"];
    const extension = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      callback(new Error("Chỉ chấp nhận file Excel (.xlsx, .xls)."));
      return;
    }

    callback(null, true);
  }
});
