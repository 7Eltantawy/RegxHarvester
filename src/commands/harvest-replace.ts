import { window } from "vscode";
import { getMetaJson } from "../actions/file-manager/manage-meta-file";
import { getSelectedTemplate } from "./get-selected-template";
import { replaceBaseAction } from "../actions/replace/replace";

export async function harvestReplace() {
  let template: TemplateBase | undefined = await getSelectedTemplate();
  if (template) {
    try {
      const meta = await getMetaJson();
      window.showInformationMessage(`${meta.length}`);
      await replaceBaseAction(meta, template.replaceTemplate, false);
    } catch (error) {
      window.showErrorMessage(`${error}`);
    }
  }
}

export async function harvestReverseReplace() {
  let template: TemplateBase | undefined = await getSelectedTemplate();
  if (template) {
    try {
      const meta = await getMetaJson();
      window.showInformationMessage(`${meta.length}`);
      await replaceBaseAction(meta, template.replaceTemplate, true);
    } catch (error) {
      window.showErrorMessage(
        `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  }
}
