import { window } from "vscode";
import { promptForSelectedTemplate } from "../utils";
import { predefinedTemplates } from "../templates/predefined-templates";
import { userDefinedTemplates } from "../templates/templates";
import { extVersion } from "../config";
import {
  createExtensionJson,
  getExtensionJson,
} from "../actions/file-manager/manage-extension-file";
import { createWorkspaceDir } from "../actions/file-manager/manage-workspace-dir";

export async function getSelectedTemplate(): Promise<TemplateBase | undefined> {
  let template: TemplateBase | undefined;
  const templates: TemplateBase[] = predefinedTemplates.concat(
    userDefinedTemplates()
  );

  try {
    const config = getExtensionJson();
    if (config) {
      template = config.selectedTemplate;
    }
  } catch (_) {}

  if (!template) {
    template = await promptForSelectedTemplate(templates);
  }

  if (template) {
    createWorkspaceDir();
    createExtensionJson({ version: extVersion, selectedTemplate: template });
    return template;
  } else {
    window.showErrorMessage("Template can not be empty");
    return;
  }
}

export async function chooseTemplate(): Promise<TemplateBase | undefined> {
  let template: TemplateBase | undefined;
  const templates: TemplateBase[] = predefinedTemplates.concat(
    userDefinedTemplates()
  );

  template = await promptForSelectedTemplate(templates);

  if (template) {
    createWorkspaceDir();
    createExtensionJson({ version: extVersion, selectedTemplate: template });
    return template;
  }
}
