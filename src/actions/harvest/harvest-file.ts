import * as fs from "fs/promises";
import { harvestString } from "./harvest-string";

export async function harvestFileStrings(
  filePath: string,
  regxIncludes: RegExp[],
  regxExcludes?: RegExp[]
): Promise<string[]> {
  const content = await fs.readFile(filePath, "utf-8");

  return await harvestString(content, regxIncludes, regxExcludes);
}
