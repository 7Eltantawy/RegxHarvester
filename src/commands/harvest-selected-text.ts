import { window } from "vscode";
import { getSelectedTemplate } from "./get-selected-template";
import {
  storeInMetaJson,
  getMetaJson,
} from "../actions/file-manager/manage-meta-file";
import { createOutputFile } from "../actions/file-manager/manage-output-file";
import { mapToOutputString } from "../utils/map-string-output";
import { replaceBaseAction } from "../actions/replace/replace";

export async function harvestSelectedText() {
  let template: TemplateBase | undefined = await getSelectedTemplate();
  if (template) {
    const editor = window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      if (selectedText) {
        const file = editor.document.uri;

        const outputStringList: OutputString[] = mapToOutputString(
          file.fsPath,
          [selectedText],
          template.templateKeyConfig.keyCase,
          template.templateKeyConfig
        );

        await storeInMetaJson(outputStringList);
        await createOutputFile(
          await getMetaJson(),
          template.outputPath,
          template.outputFileName,
          template.outputFileTemplate,
          template.stringTemplate
        );

        if (template.replaceAfterCreate) {
          await replaceBaseAction(
            await getMetaJson(),
            template.replaceTemplate,
            false
          );
        }

        window.showInformationMessage(`Text Harvested Successfully`);
      }
    }
  }
}
