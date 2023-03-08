import { workspace } from "vscode";

export const getConfiguration = <T>(key: string) => {
  return workspace.getConfiguration("regx-harvester").get<T>(key);
};

export const getEnableSelectionHover = () => {
  return getConfiguration<boolean>("enableSelectionHover") ?? true;
};

export function getUserDefinedTemplates(): Array<TemplateBase> {
  return getConfiguration<Array<TemplateBase>>("templates") ?? [];
}
