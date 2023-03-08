import { commands, ExtensionContext } from "vscode";
import * as harvestCommands from "./commands/commands";
import { chooseTemplate } from "./commands/get-selected-template";
import { registerHover } from "./actions/selection/hover";
import { registerSelectionBehavior } from "./actions/selection/selection";

// Select Template
// Create .stringharvest Folder
// store data in .stringharvest
// Select Path of output
// Createing......
// Ask if you to update if any change happened
// Ask if you to replace

export function activate(context: ExtensionContext) {
  registerHover(context);
  registerSelectionBehavior(context);

  context.subscriptions.push(
    commands.registerCommand("extension.chooseTemplate", chooseTemplate),

    //
    commands.registerCommand(
      "extension.harvestSelectedFile",
      harvestCommands.harvestSelectedFile
    ),
    commands.registerCommand(
      "extension.harvestSelectedFolder",
      harvestCommands.harvestSelectedFolder
    ),
    commands.registerCommand(
      "extension.harvestSelectedText",
      harvestCommands.harvestSelectedText
    ),
    commands.registerCommand(
      "extension.harvestWorkspace",
      harvestCommands.harvestWorkspace
    ),
    commands.registerCommand(
      "extension.harvestReplace",
      harvestCommands.harvestReplace
    ),
    commands.registerCommand(
      "extension.harvestReverseReplace",
      harvestCommands.harvestReverseReplace
    )
  );
}
