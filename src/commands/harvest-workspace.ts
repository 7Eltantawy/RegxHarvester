import { window } from "vscode";
import { findAllFilesInWorkspace } from "../utils";
import { getSelectedTemplate } from "./get-selected-template";
import { harvestFileBase } from "./harvest-file-base";

export async function harvestWorkspace() {
  let template: TemplateBase | undefined = await getSelectedTemplate();
  if (template) {
    const files = await findAllFilesInWorkspace(
      template.foldersToIncludes,
      template.foldersToExcludes,
      template.extsToIncludes,
      template.extsToExcludes
    );

    try {
      harvestFileBase(files);
      window.showInformationMessage("WorkSpace Harvested Successfully");
    } catch (error) {
      window.showErrorMessage(
        `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  }
}
