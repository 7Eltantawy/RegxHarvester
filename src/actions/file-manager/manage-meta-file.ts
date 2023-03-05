import * as vscode from "vscode";
import * as fs from "fs";
import { recreateList } from "../../utils/map-string-output";

export const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
const harvestDirPath = vscode.Uri.file(`${workspacePath}/.harvest`);
const metaJsonPath = vscode.Uri.file(`${harvestDirPath.fsPath}/meta.json`);

export async function storeInMetaJson(outputStringList: OutputString[]) {
  const meta = await getMetaJson();

  if (meta) {
    await addToMetaJson(recreateList(outputStringList));
  } else {
    await createMetaJson(recreateList(outputStringList));
  }
}

async function addToMetaJson(outputStringList: OutputString[]) {
  await createMetaJson([...(await getMetaJson()), ...outputStringList]);
}

async function createMetaJson(outputStringList: OutputString[]) {
  if (!workspacePath) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  const filtered = sorOutputString(
    filterDuplicateOutputStrings(outputStringList)
  );

  const metaJsonData = JSON.stringify(filtered, null, 2);
  const metaJsonDataBuffer = Buffer.from(metaJsonData, "utf8");
  await vscode.workspace.fs.writeFile(metaJsonPath, metaJsonDataBuffer);
}

export async function getMetaJson(): Promise<OutputString[]> {
  try {
    const fileContents = await fs.readFileSync(metaJsonPath.fsPath, "utf-8");
    return JSON.parse(fileContents) as OutputString[];
  } catch (error) {
    return [];
  }
}

function filterDuplicateOutputStrings(
  outputStrings: OutputString[]
): OutputString[] {
  const uniqueOutputStrings: OutputString[] = [];
  outputStrings.forEach((os) => {
    const existingOutputString = uniqueOutputStrings.find(
      (uos) =>
        uos.key === os.key &&
        uos.rawValue === os.rawValue &&
        uos.filePath === os.filePath
    );
    if (!existingOutputString) {
      uniqueOutputStrings.push(os);
    }
  });
  return uniqueOutputStrings;
}

function sorOutputString(outputStrings: OutputString[]): OutputString[] {
  return outputStrings.sort((a, b) => a.key.localeCompare(b.key));
}
