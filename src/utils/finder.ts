import { RelativePattern, Uri, workspace } from "vscode";

export async function findFilesInPath(
  rootPath: string,
  folderIncludes: string[] = [],
  folderExcludes: string[] = [],
  extIncludes: string[] = [],
  extExcludes: string[] = [],
  filterFolders: boolean,
  filterFiles: boolean
): Promise<Uri[]> {
  const workspaceFolders = workspace.workspaceFolders;
  if (!workspaceFolders) {
    return [];
  }

  const includePattern = new RelativePattern(rootPath, "**/*");

  const files = await workspace.findFiles(
    includePattern,
    undefined,
    undefined,
    undefined
  );

  let selectedFiles: Uri[] = files;

  if (filterFolders) {
    selectedFiles = await filterFoldersAction(
      selectedFiles,
      folderIncludes,
      folderExcludes
    );
  }

  if (filterFiles) {
    selectedFiles = await filterFilesAction(
      selectedFiles,
      extIncludes,
      extExcludes
    );
  }

  return selectedFiles;
}

export async function findAllFilesInWorkspace(
  folderIncludes: string[] = [],
  folderExcludes: string[] = [],
  extIncludes: string[] = [],
  extExcludes: string[] = []
): Promise<Uri[]> {
  const searchPromises = workspace.workspaceFolders?.map(async (folder) => {
    const rootPath = folder.uri.fsPath;
    return findFilesInPath(
      rootPath,
      folderIncludes,
      folderExcludes,
      extIncludes,
      extExcludes,
      true,
      true
    );
  });

  const searchResults = await Promise.all(searchPromises || []);
  const allFiles = searchResults.flat();
  return allFiles;
}

async function filterFoldersAction(
  uris: Uri[],
  folderIncludes: string[] = [],
  folderExcludes: string[] = []
): Promise<Uri[]> {
  let filteredUris = uris;

  if (folderIncludes.length > 0) {
    filteredUris = filteredUris.filter((uri) => {
      const relativePath = workspace.asRelativePath(uri);
      return folderIncludes.some((folder) => relativePath.startsWith(folder));
    });
  }

  if (folderExcludes.length > 0) {
    filteredUris = filteredUris.filter(
      (uri) => !folderExcludes.some((folder) => uri.fsPath.includes(folder))
    );
  }

  return filteredUris;
}

async function filterFilesAction(
  uris: Uri[],
  extIncludes: string[] = [],
  extExcludes: string[] = []
): Promise<Uri[]> {
  let filteredUris = uris;

  if (extIncludes.length > 0) {
    filteredUris = filteredUris.filter((uri) => {
      return extIncludes.some((folder) => uri.fsPath.endsWith(folder));
    });
  }

  if (extExcludes.length > 0) {
    filteredUris = filteredUris.filter(
      (uri) => !extExcludes.some((folder) => uri.fsPath.includes(folder))
    );
  }

  return filteredUris;
}
