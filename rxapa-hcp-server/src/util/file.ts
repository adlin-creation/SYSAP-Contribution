import fs from "fs";

export const deleteFile = (filePath: string) => {
  if (!filePath) {
    console.error("File path is empty. Cannot delete file.");
    return;
  }
  // deletes file
  fs.unlink(filePath, (error: any) => {
    if (error) {
      throw error;
    }
  });
};