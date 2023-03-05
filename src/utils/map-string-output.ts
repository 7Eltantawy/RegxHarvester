import { workspace } from "vscode";
import { keyCaseConvertor } from "./key-case-convertor";

export function mapToOutputString(
  filePath: string,
  stringList: string[],
  keyCase: string,
  templateKeyConfigs: TemplateKeyConfig | undefined
): OutputString[] {
  let outputStrings: OutputString[] = [];

  outputStrings = stringList.map((s: string): OutputString => {
    return createOutputString(filePath, s, keyCase, templateKeyConfigs);
  });

  return outputStrings;
}

function createOutputString(
  filePath: string,
  value: string,
  keyCase: string,
  templateKeyConfigs: TemplateKeyConfig | undefined
) {
  let generatedKey = keyCaseConvertor(keyCase, value);
  if (value) {
    if (templateKeyConfigs) {
      templateKeyConfigs.keyConfigs?.map((config) => {
        if (config.regx.test(generatedKey)) {
          generatedKey = config.replaceWith.replace("<{key}>", generatedKey);
        }
      });
    }
  }
  const out: OutputString = {
    key: generatedKey,
    rawValue: value,
    filePath: workspace.asRelativePath(filePath),
  };

  return out;
}

export function recreateList(list: OutputString[]): OutputString[] {
  const map: { [key: string]: number } = {};
  const result: OutputString[] = [];

  for (const item of list) {
    const existingItem = result.find((x) => x.rawValue === item.rawValue);
    if (existingItem) {
      // if an item with the same rawValue already exists in the result, reuse its key
      result.push({ ...item, key: existingItem.key });
    } else if (!map[item.key]) {
      // if the key doesn't exist in the map yet, add it with count 1
      map[item.key] = 1;
      result.push(item);
    } else {
      // increment the count for the key and add it to the result with the new count
      const newKey = `${item.key}${map[item.key]++}`;
      result.push({ ...item, key: newKey });
    }
  }

  return result;
}
