import {
  ExtensionContext,
  Hover,
  languages,
  MarkdownString,
  Uri,
} from "vscode";
import { isHoverOnSelection } from "./doc-service";
import { getContent } from "./store";

export const registerHover = (context: ExtensionContext) => {
  const hover = languages.registerHoverProvider(
    { scheme: "file" },
    {
      provideHover(document, position) {
        if (isHoverOnSelection(position)) {
          const result = getContent();
          if (result.length > 0) {
            const harvestTxtCmdUri = Uri.parse(
              `command:extension.harvestSelectedText`
            );
            const harvestReplaceCmdUri = Uri.parse(
              `command:extension.harvestReplace`
            );
            const harvestReverseReplaceCmdUri = Uri.parse(
              `command:extension.harvestReverseReplace`
            );

            const copyCmdBtn = `[Harvest Text](${harvestTxtCmdUri} "Harvest Text")`;
            const replaceCmdBtn = `[Replace](${harvestReplaceCmdUri} "Replace Text with generated template.")`;
            const reverseReplaceCmdBtn = `[Reverse Replace](${harvestReverseReplaceCmdUri} "Get the original text before harvest")`;

            const commands = new MarkdownString(
              `${copyCmdBtn} | ${replaceCmdBtn} | ${reverseReplaceCmdBtn}`,
              true
            );

            commands.isTrusted = true;

            const header = new MarkdownString("RegxHarvester");
            const content = new MarkdownString(result);

            // Build
            const hover: Hover = new Hover([header, content, commands]);
            return hover;
          }
          return null;
        }
        return null;
      },
    }
  );
  context.subscriptions.push(hover);
};
