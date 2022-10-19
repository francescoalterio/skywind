import { readFile } from "node:fs/promises";

export async function getFileContent(filePath) {
  const content = await readFile(filePath, { encoding: "utf8" });
  return content;
}
