import { OpenDialogOptions, window } from "vscode";
import * as _ from "lodash";

export async function promptForSelectedTemplate(
  templates: TemplateBase[]
): Promise<TemplateBase | undefined> {
  const names: string[] = templates.map((template) => template.templateName);

  const selectedTemplateName = await window.showQuickPick(names);
  const selectedTemplate: TemplateBase | undefined = templates.find(
    (template: TemplateBase) => template.templateName === selectedTemplateName
  );
  return selectedTemplate;
}

export async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the Module in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}
