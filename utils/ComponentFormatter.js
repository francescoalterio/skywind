//do not delete this import
import fetch from "node-fetch";

export default class ComponentFormatter {
  static formatHTMLInJS(contentFile) {
    if (contentFile.indexOf("<>") !== -1) {
      const newContentFile = contentFile.replace("<>", "`").replace("</>", "`");
      return this.formatHTMLInJS(newContentFile);
    } else {
      return contentFile;
    }
  }
  
  static formatImportsRegExp(contentFile) {
    const allImportsRegExp = /import (\w+,)? ?{?[\w, ]+?}? from ('|"|`)+[a-zA-Z\.\/\:]+('|"|`);?/g
    const allImports = contentFile.match(allImportsRegExp)
    if(allImports !== null) {
      const allImportsWithNamedImports = allImports.map(x => {
        const regExpNamedImports = /{[\w, ]+}/g
        const regExpPredeterminedImports = /import [\w,]+/g
        const predeterminedImport = x.match(regExpPredeterminedImports)
        const regExpPath = /('|"|`)[\w.\/\:]+('|"|`)/g
  
        const namedImports = x.match(regExpNamedImports) !== null ? x.match(regExpNamedImports)[0] : undefined
        const allImport = x
        const defaultImport = predeterminedImport !== null ? predeterminedImport[0].replace('import ', '').replace(',', '') : undefined
        const path = `'${x.match(regExpPath)[0].charAt(1) === '/' ? "../../.." : ""}${x.match(regExpPath)[0].replace(/['"`]/g, '')}'`
        const dynamicImportWithPredeterminatedImport = defaultImport && namedImports 
        ? namedImports.replace('}', `, default: ${defaultImport}}`) 
        : defaultImport ? `{default: ${defaultImport}}` : namedImports
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
  }
  
  static changeFileImports(contentFile, imports) {
    const allImportsRegExp = /import (\w+,)? ?{?[\w, ]+?}? from ('|"|`)+[a-zA-Z\.\/\:]+('|"|`);?/g
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

  static formatComponentProps(componentBody) {

  }

  static formatComponentSyntax(contentFile) {
    const allComponentsRegExp = /<[A-Z]\w+.+\/>/g
    const allComponents = contentFile.match(allComponentsRegExp)
    if (allComponents !== null) {
      allComponents.forEach(x => {
        const componentNameRegExp = /<[A-Z]\w+/g
        const componentName = x.match(componentNameRegExp)[0].replace('<', '')
        const componentFormatted = '${' + `await ${componentName}()` + '}'
        contentFile = contentFile.replace(x, componentFormatted)
      })
    }

    return contentFile
  }
  
  static formatComponent(contentFile, props = {}) {
    let html = "";
    const dashsEliminated = contentFile
      .replace("<>", "return `")
      .replace("</>", "`");
    const htmlEdited = this.formatHTMLInJS(dashsEliminated);
    const allImportsFormated = this.formatImportsRegExp(htmlEdited);
    const allImportsChanged = this.changeFileImports(htmlEdited, allImportsFormated)
    const allComponentsChanged = this.formatComponentSyntax(allImportsChanged)
    console.log(allComponentsChanged);
    const usingFunction = `async function usingAsyncFunction() {
      ${allComponentsChanged}
    }
    html = usingAsyncFunction()
    `;
    eval(usingFunction);
    return html;
  }
  
}


