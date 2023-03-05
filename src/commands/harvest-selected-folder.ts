import { Uri, window } from "vscode";
import { findFilesInPath, promptForTargetDirectory } from "../utils";
import _ = require("lodash");
import { lstatSync } from "fs";
import { getSelectedTemplate } from "./get-selected-template";
import { harvestFileBase } from "./harvest-file-base";

export async function harvestSelectedFolder(uri: Uri) {
  let template: TemplateBase | undefined = await getSelectedTemplate();
  if (template) {
    let targetDirectory;
    if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
      targetDirectory = await promptForTargetDirectory();
      if (_.isNil(targetDirectory)) {
        window.showErrorMessage("Please select a valid directory");
        return;
      }
    } else {
      targetDirectory = uri.fsPath;
    }

    const files = await findFilesInPath(
      targetDirectory,
      template.foldersToIncludes ?? [],
      template.foldersToExcludes,
      template.extsToIncludes,
      template.extsToExcludes,
      false,
      true
    );

    try {
      harvestFileBase(files);
      window.showInformationMessage("Folder Harvested Successfully");
    } catch (error) {
      window.showErrorMessage(
        `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  }
}
