import { Uri, workspace } from "vscode";
import * as fs from "fs";

const workspacePath = workspace.workspaceFolders?.[0]?.uri.fsPath;

export async function replaceBaseAction(
  outputStrings: OutputString[],
  replaceTemplate: String,
  reverse: boolean
) {
  // Very Importantant step
  // For example when replace seeMore serrMore01
  // if seeMore come first the reverse will be broken
  const outputs = outputStrings.sort((a, b) => b.key.length - a.key.length);

  for (const output of outputs) {
    const absolutePath = Uri.file(`${workspacePath}/${output.filePath}`).fsPath;
    const fileContents = await fs.readFileSync(absolutePath, "utf8");

    let searchValue = output.rawValue;
    let replaceValue = replaceTemplate.replace("<{key}>", output.key);

    if (reverse) {
      replaceValue = output.rawValue;
      searchValue = replaceTemplate.replace("<{key}>", output.key);
    }

    const searchValueRegx = new RegExp(searchValue, "g");
    const newFileContents = fileContents.replace(searchValueRegx, replaceValue);
    await fs.writeFileSync(absolutePath, newFileContents, "utf8");
  }
}
