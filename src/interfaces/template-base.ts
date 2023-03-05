interface TemplateBase {
  templateName: string;
  //
  regxToIncludes: RegExp[];
  regxToExcludes?: RegExp[];
  //
  extsToIncludes?: string[];
  extsToExcludes?: string[];
  foldersToIncludes?: string[];
  foldersToExcludes?: string[];
  // Output config
  outputPath: string;
  outputFileName: string;
  outputFileTemplate: string;
  stringTemplate: string;
  replaceTemplate: string;
  templateKeyConfig: TemplateKeyConfig;
  // Setting
  replaceAfterCreate: boolean;
}

interface TemplateKeyConfig {
  keyCase: string;
  keyConfigs?: KeyConfig[];
}

interface KeyConfig {
  regx: RegExp;
  replaceWith: string;
}
