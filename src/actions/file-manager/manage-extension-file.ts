import * as vscode from "vscode";
import * as fs from "fs";
import {
  extensionConfingsFromJson,
  extensionConfingsToJson,
} from "../../utils";
import { extensionSchema } from "../../json_schema/extension";

export const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
const harvestDirPath = vscode.Uri.file(`${workspacePath}/.harvest`);

const extfileName: string = "extension";
const extensionJsonPath = vscode.Uri.file(
  `${harvestDirPath.fsPath}/${extfileName}.json`
);

const extSchemafileName: string = `${extfileName}.schema.json`;
const extensionSchemaDestPath = vscode.Uri.file(
  `${harvestDirPath.fsPath}/${extSchemafileName}`
);

async function createExtensionJsonSchema() {
  const metaJsonContent = Buffer.from(extensionSchema, "utf8");
  vscode.workspace.fs.writeFile(extensionSchemaDestPath, metaJsonContent);
}

export function createExtensionJson(extensionConfings: ExtensionConfings) {
  if (!workspacePath) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  createExtensionJsonSchema();
  const extensionJsonData = extensionConfingsToJson(extensionConfings);
  const extensionJsonContent = Buffer.from(extensionJsonData, "utf8");
  vscode.workspace.fs.writeFile(extensionJsonPath, extensionJsonContent);
}

export function getExtensionJson(): ExtensionConfings | undefined {
  const fileContents = fs.readFileSync(extensionJsonPath.fsPath, "utf-8");
  return extensionConfingsFromJson(fileContents);
}
