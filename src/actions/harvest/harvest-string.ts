export const harvestString = async (
  content: string,
  regxIncludes: RegExp[],
  regxExcludes?: RegExp[]
): Promise<string[]> => {
  let allHarvestedText: string[] = [];
  let acceptedText: string[] = [];

  for (let index = 0; index < regxIncludes.length; index++) {
    const regex = regxIncludes[index];
    const matches = content.match(regex);
    if (matches) {
      allHarvestedText = [...allHarvestedText, ...matches];
    }
  }

  acceptedText = allHarvestedText;

  if (regxExcludes) {
    acceptedText = allHarvestedText.filter((s: string) => {
      for (const r of regxExcludes) {
        if (r.test(s)) {
          return false;
        }
      }
      return true;
    });
  }

  return acceptedText;
};
