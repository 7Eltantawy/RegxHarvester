const flutterTemplate: TemplateBase = {
  templateName: "Flutter String Harvester",

  regxToIncludes: [/(['"])(?:(?!\1).)*\1/g],
  regxToExcludes: [
    /\$/,
    /['"]dart:.*["']/,
    /['"]package:.*.dart["']/,
    /['"][a-z]+:[a-z]+['"];/,
    /['"][a-z]+:(\w+\/)+(\w+\.[a-z]+)['"];/,
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  ],

  extsToIncludes: [".dart"],
  extsToExcludes: [".g.dart", "app_string.dart"],

  foldersToIncludes: ["lib"],

  outputPath: "lib/resources/",
  outputFileName: "app_string.dart",
  outputFileTemplate: "class AppString{\n<{body}>\n}\n",
  stringTemplate: "static const String <{key}> = <{value}> ;\n",
  replaceTemplate: "AppString.<{key}>",
  templateKeyConfig: {
    keyCase: "camelCase",
    keyConfigs: [
      {
        regx: /^\d/,
        replaceWith: "anHarvestedNum<{key}>",
      },
      {
        regx: /^$/,
        replaceWith: "aHarvestedText",
      },
    ],
  },
  replaceAfterCreate: false,
};

export const predefinedTemplates: TemplateBase[] = [flutterTemplate];
