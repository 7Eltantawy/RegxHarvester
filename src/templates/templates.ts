import { workspace } from "vscode";

export function userDefinedTemplates(): Array<TemplateBase> {
  const config = workspace.getConfiguration("regx-harvester");
  return config.get<Array<TemplateBase>>("templates") ?? [];
}
