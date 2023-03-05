import mkdirp = require("mkdirp");
import * as vscode from "vscode";

export const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
const harvestDirPath = vscode.Uri.file(`${workspacePath}/.harvest`);

export function createWorkspaceDir() {
  if (!workspacePath) {
    vscode.workspace.fs.createDirectory(harvestDirPath);
  }
}

export function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}
