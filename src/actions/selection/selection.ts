import {
  commands,
  ExtensionContext,
  TextEditorSelectionChangeEvent,
  TextEditorSelectionChangeKind,
  window,
} from "vscode";
import { setContent } from "./store";
import { getEnableSelectionHover } from "../../utils/config";
import { setCurrentEditor } from "./doc-service";

export const registerSelectionBehavior = (context: ExtensionContext) => {
  if (!getEnableSelectionHover()) {
    return;
  }
  setCurrentEditor();
  let hoverTimer: NodeJS.Timeout;
  const selectionChanged = window.onDidChangeTextEditorSelection(async (e) => {
    clearTimeout(hoverTimer);
    let latencyTime = 300;
    hoverTimer = setTimeout(async () => {
      await showHover(e);
    }, latencyTime);
  });
  context.subscriptions.push(selectionChanged);
};

const showHover = async (e: TextEditorSelectionChangeEvent) => {
  try {
    const selections = e.selections.filter((selection) => !selection.isEmpty);
    if (
      selections.length !== 1 ||
      e.kind !== TextEditorSelectionChangeKind.Mouse
    ) {
      return;
    }
    const text = e.textEditor.document.getText(selections[0]);
    setContent("");
    const result = text;
    setContent(result);
    commands.executeCommand("editor.action.showHover");
  } catch (error: any) {
    window.showErrorMessage(`Error occurs. ${error}`);
  }
};
