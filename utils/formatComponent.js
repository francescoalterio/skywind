import fetch from "node-fetch";

function formatHTMLInJS(contentFile) {
  if (contentFile.indexOf("<>") !== -1) {
    const newContentFile = contentFile.replace("<>", "`").replace("</>", "`");
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
    return formatImports(newContentFile);
  } else {
    return contentFile;
  }
}

function formatImportsRegExp(contentFile) {
  const allImportsRegExp = /import (\w+,)? ?{[\w, ]+} from ('|"|`)+[a-zA-Z\.\/]+('|"|`)/g
  const allImports = contentFile.match(allImportsRegExp)
  console.log(allImports)
  const allImportsWithNamedImports = allImports.map(x => {
    const regExpNamedImports = /{[\w, ]+}/g
    const regExpPredeterminedImports = /import [\w,]+/g
    const predeterminedImport = x.match(regExpPredeterminedImports)
    const regExpPath = /('|"|`)[\w.\/]+('|"|`)/g

    const namedImports = x.match(regExpNamedImports)[0]
    const allImport = x
    const defaultImport = predeterminedImport !== null ? predeterminedImport[0].replace('import ', '').replace(',', '') : undefined
    const path = x.match(regExpPath)[0]
    const dynamicImportWithPredeterminatedImport = namedImports.replace('}', `, default: ${defaultImport}}`)
    const dynamicImport = `const ${dynamicImportWithPredeterminatedImport} = await import(${path})`

    return {
      namedImports,
      defaultImport,
      path,
      dynamicImport,
      allImport
    }
  })
  return allImportsWithNamedImports
}

export async function formatComponent(contentFile) {
  let html = "";
  formatImportsRegExp(contentFile)
  const dashsEliminated = contentFile
    .replace("---", "return `<!DOCTYPE html>")
    .replace("---", "`");
  const htmlEdited = formatHTMLInJS(dashsEliminated);
  
  const usingFunction = `async function usingAsyncFunction() {
    ${htmlEdited}
  }
  html = usingAsyncFunction()
  `;
  eval(usingFunction);
  return html;
}
