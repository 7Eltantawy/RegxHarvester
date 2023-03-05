import { existsSync } from "fs";
import * as vscode from "vscode";
import { createDirectory } from "./manage-workspace-dir";

export const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

export async function createOutputFile(
  outputStringList: OutputString[],
  outputPath: string,
  outputFileName: string,
  outputFileTemplate: string,
  stringTemplate: string
) {
  const outputDirPath = vscode.Uri.file(`${workspacePath}/${outputPath}/`);
  const outputFilePath = vscode.Uri.file(
    `${outputDirPath.fsPath}/${outputFileName}`
  );

  if (!existsSync(outputDirPath.fsPath)) {
    await createDirectory(outputDirPath.fsPath);
  }

  const bodyData = outputStringToStringTemplate(
    outputStringList,
    stringTemplate
  );

  const fileData = outputFileTemplate.replace("<{body}>", bodyData.join(""));
  const fileDataBuffer = Buffer.from(fileData, "utf8");
  await vscode.workspace.fs.writeFile(outputFilePath, fileDataBuffer);
}

export async function addToOutputFile(outputStringList: OutputString[]) {}

export async function getOutputFile() {}

function outputStringToStringTemplate(
  outputStringList: OutputString[],
  stringTemplate: string
): string[] {
  const toConvert = sorOutputString(filterOutputStringsByKey(outputStringList));
  return [...new Set(toConvert)].map((text) => {
    return stringTemplate
      .replace("<{key}>", text.key)
      .replace("<{value}>", text.rawValue);
  });
}

function filterOutputStringsByKey(
  outputStringList: OutputString[]
): OutputString[] {
  return outputStringList.reduce(
    (accumulator: OutputString[], current: OutputString) => {
      const foundIndex = accumulator.findIndex(
        (element) => element.key === current.key
      );
      if (foundIndex === -1) {
        accumulator.push(current);
      }
      return accumulator;
    },
    []
  );
}

function sorOutputString(outputStrings: OutputString[]): OutputString[] {
  return outputStrings.sort((a, b) => a.key.localeCompare(b.key));
}
