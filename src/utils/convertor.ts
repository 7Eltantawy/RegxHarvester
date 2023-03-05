export function extensionConfingsToJson(
  extensionConfings: ExtensionConfings
): string {
  const replacer = (key: string, value: any) => {
    if (key === "regxToIncludes" || key === "regxToExcludes") {
      return value.map((r: RegExp) => ({
        source: r.source,
        flags: r.flags,
      }));
    }
    if (key === "regx") {
      return {
        source: value.source,
        flags: value.flags,
      };
    }
    return value;
  };
  return JSON.stringify(
    { $schema: "./extension.schema.json", ...extensionConfings },
    replacer,
    2
  );
}

export function extensionConfingsFromJson(json: string): ExtensionConfings {
  const reviver = (key: string, value: any) => {
    if (key === "regxToIncludes" || key === "regxToExcludes") {
      return value.map((o: any) => new RegExp(o.source, o.flags));
    }
    if (key === "regx") {
      return new RegExp(value.source, value.flags);
    }
    return value;
  };
  return JSON.parse(json, reviver) as ExtensionConfings;
}
