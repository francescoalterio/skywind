import fetch from "node-fetch";

function formatHTMLInJS(contentFile) {
  if (contentFile.indexOf("<>") !== -1) {
    console.log(contentFile);
    const newContentFile = contentFile.replace("<>", "`").replace("</>", "`");
    console.log(newContentFile);
    return formatHTMLInJS(newContentFile);
  } else {
    return contentFile;
  }
}

function formatImports(contentFile) {
  if (
    contentFile.indexOf("import ") !== -1 ||
    contentFile.indexOf(`import('`) !== -1 ||
    contentFile.indexOf(`import("`) !== -1
  ) {
    console.log(contentFile);

    let newContentFile = contentFile
      .replace("import ", "const ")
      .replace("from ", "= await import(");

    if (contentFile.indexOf(`import('`) !== -1) {
      newContentFile = newContentFile
        .replace("import('", "import(`")
        .replace(`'`, "`)");
    } else if (contentFile.indexOf(`import("`) !== -1) {
      newContentFile = newContentFile
        .replace('import("', "import(`")
        .replace(`"`, "`)");
    }

    console.log(newContentFile);
    return formatImports(newContentFile);
  } else {
    return contentFile;
  }
}

export async function formatComponent(contentFile) {
  let html = "";
  const dashsEliminated = contentFile
    .replace("---", "return `<!DOCTYPE html>")
    .replace("---", "`");
  const htmlEdited = formatHTMLInJS(dashsEliminated);
  const fileEdited = formatImports(htmlEdited);
  const usingFunction = `async function usingAsyncFunction() {
    ${fileEdited}
  }
  html = usingAsyncFunction()
  `;
  eval(usingFunction);
  console.log(html);
  return html;
}
