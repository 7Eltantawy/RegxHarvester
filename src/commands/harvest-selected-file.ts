import { Uri, window } from "vscode";
import { getSelectedTemplate } from "./get-selected-template";
import { harvestFileBase } from "./harvest-file-base";

export async function harvestSelectedFile(uri: Uri) {
  let template: TemplateBase | undefined = await getSelectedTemplate();
  if (template && uri) {
    const files = [uri];
    try {
      harvestFileBase(files);
      window.showInformationMessage("File Harvested Successfully");
    } catch (error) {
      window.showErrorMessage(
        `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  } else {
    window.showInformationMessage(`Right click file and select harvest file`);
  }
}
