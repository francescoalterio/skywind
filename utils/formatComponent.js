//do not delete this import
import fetch from "node-fetch";

function formatHTMLInJS(contentFile) {
  if (contentFile.indexOf("<>") !== -1) {
    const newContentFile = contentFile.replace("<>", "`").replace("</>", "`");
    return formatHTMLInJS(newContentFile);
  } else {
    return contentFile;
  }
}

function formatImportsRegExp(contentFile) {
  const allImportsRegExp = /import (\w+,)? ?{[\w, ]+} from ('|"|`)+[a-zA-Z\.\/]+('|"|`)/g
  const allImports = contentFile.match(allImportsRegExp)
  if(allImports !== null) {
    const allImportsWithNamedImports = allImports.map(x => {
      const regExpNamedImports = /{[\w, ]+}/g
      const regExpPredeterminedImports = /import [\w,]+/g
      const predeterminedImport = x.match(regExpPredeterminedImports)
      const regExpPath = /('|"|`)[\w.\/]+('|"|`)/g

      const namedImports = x.match(regExpNamedImports)[0]
      const allImport = x
      const defaultImport = predeterminedImport !== null ? predeterminedImport[0].replace('import ', '').replace(',', '') : undefined
      const path = x.match(regExpPath)[0]
      const dynamicImportWithPredeterminatedImport = defaultImport ? namedImports.replace('}', `, default: ${defaultImport}}`) : namedImports
      const dynamicImport = `const ${dynamicImportWithPredeterminatedImport} = await import(../../../${path})`

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
}

function changeFileImports(contentFile, imports) {
  const allImportsRegExp = /import (\w+,)? ?{[\w, ]+} from ('|"|`)+[a-zA-Z\.\/]+('|"|`)/g
  const allImports = contentFile.match(allImportsRegExp)
  if (allImports !== null) {
    allImports.forEach(x => {
      const dynamicImport = imports.find(y => y.allImport === x).dynamicImport
      console.log(dynamicImport);
      contentFile = contentFile.replace(x, dynamicImport)
    })
  }
  return contentFile;
}

export async function formatComponent(contentFile) {
  let html = "";
  const dashsEliminated = contentFile
    .replace("<>", "return `<!DOCTYPE html>")
    .replace("</>", "`");
  const htmlEdited = formatHTMLInJS(dashsEliminated);
  const allImportsFormated = formatImportsRegExp(htmlEdited);
  const allImportsChanged = changeFileImports(htmlEdited, allImportsFormated)
  const usingFunction = `async function usingAsyncFunction() {
    ${allImportsChanged}
  }
  html = usingAsyncFunction()
  `;
  eval(usingFunction);
  return html;
}
