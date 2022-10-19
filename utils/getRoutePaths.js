import fs from "fs";

export async function getRoutePaths(
  currentPath,
  pathList = [],
  allRoutePaths = [],
  rootPath = ""
) {
  pathList.pop();

  if (allRoutePaths.length === 0 && pathList.length === 0) {
    rootPath = currentPath;
  }

  const allDirFiles = await fs.promises.readdir(currentPath);
  const testFiles = allDirFiles.filter((x) => x.includes(".js"));
  if (testFiles.length > 0) {
    testFiles.forEach((x) => {
      const name = x.split(".")[0];
      const rootPathDeleted = `${currentPath}/${x}`.replace(rootPath, "");
      const routeData = {
        name,
        path: `${currentPath}/${x}`,
        type: "file",
        url:
          name === "index"
            ? rootPathDeleted.replace("/index.js", "") === ""
              ? rootPathDeleted.replace("/index.js", "/")
              : rootPathDeleted.replace("/index.js", "")
            : rootPathDeleted.replace(".js", ""),
      };
      allRoutePaths.push(routeData);
    });
  }

  const contentDir = await fs.promises.opendir(currentPath);
  for await (const dirent of contentDir) {
    if (dirent.isDirectory()) {
      const routeData = {
        name: dirent.name,
        path: `${currentPath}/${dirent.name}`,
        type: "dir",
        url: `${currentPath}/${dirent.name}`.replace(rootPath, ""),
      };
      pathList.push(`${currentPath}/${dirent.name}`);
      allRoutePaths.push(routeData);
    }
  }

  if (pathList.length > 0) {
    return getRoutePaths(
      pathList[pathList.length - 1],
      pathList,
      allRoutePaths,
      rootPath
    );
  } else {
    return allRoutePaths;
  }
}
