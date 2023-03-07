import { Uri } from "vscode";
import { mapToOutputString } from "../utils/map-string-output";
import {
  getMetaJson,
  storeInMetaJson,
} from "../actions/file-manager/manage-meta-file";
import { createOutputFile } from "../actions/file-manager/manage-output-file";
import { harvestFileStrings } from "../actions/harvest/harvest-file";
import { getSelectedTemplate } from "./get-selected-template";
import { replaceBaseAction } from "../actions/replace/replace";

export async function harvestFileBase(files: Uri[]) {
  let template: TemplateBase | undefined = await getSelectedTemplate();
  if (template) {
    let outputStringList: OutputString[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      let strings: string[] = [];

      strings = await harvestFileStrings(
        file.fsPath,
        template.regxToIncludes,
        template.regxToExcludes
      );

      const tempOutputStringList: OutputString[] = mapToOutputString(
        file.fsPath,
        strings,
        template.templateKeyConfig.keyCase,
        template.templateKeyConfig
      );
      outputStringList = [...outputStringList, ...tempOutputStringList];
    }
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
  }
}
