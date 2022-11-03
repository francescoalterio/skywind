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
  

  static formatComponentProps(componentBody) {
    const allPropsRegExp = /\w+=['"`{][\w{}'"`\s!@#$%^*()_+\[\],.]+['"`}]+/g
    const allProps = componentBody.match(allPropsRegExp)
    let props = '{';
    if(allProps !== null) {
      allProps.forEach(x => {
        const removeKeys = x.replace('{', '').replace('}', '')
        const changeEqualForTwoPoints = removeKeys.replace('=', ':')
        props += ` ${changeEqualForTwoPoints},`
      })
    }
    return `${props}}`
  }

  static formatComponentSyntax(contentFile) {
    const allComponentsRegExp = /<[A-Z]\w+.+\/>/g
    const allComponents = contentFile.match(allComponentsRegExp)
    if (allComponents !== null) {
      allComponents.forEach(x => {
        const componentNameRegExp = /<[A-Z]\w+/g
        const componentName = x.match(componentNameRegExp)[0].replace('<', '')
        const propsFormatted = this.formatComponentProps(x)
        console.log("***********",propsFormatted);
        const componentFormatted = '${' + `await ${componentName}(${propsFormatted})` + '}'
        contentFile = contentFile.replace(x, componentFormatted)
      })
    }

    return contentFile
  }

  static formatImportStylesheet (contentFile) {
    const allStylesheetsRegExp = /Skywind\.importStylesheet.+/g
    const allStylesheets = contentFile.match(allStylesheetsRegExp)
    if (allStylesheets!== null) {
      allStylesheets.forEach(x => {
        const styleBody = '<style type="text/css"> ${await ' + x +'}</style>'
        contentFile = contentFile.replace(x, "");
        contentFile = contentFile.replace('return `', 'return `' + styleBody)
      })
    }
    return contentFile
  }

  static getAllImports(contentFile) {
    const getAllImportsRegExp = /import (\w+,)? ?{?[\w, ]+?}? from ('|"|`)+.+('|"|`);?/g
    const allImports = contentFile.match(getAllImportsRegExp)
    if(allImports !== null) {
      const removeSemicolon = allImports.map(x => x.replace(';', ''))
      const joinAllImports = removeSemicolon.join(';\n')
      const removeImportsInContentFile = contentFile.replace(getAllImportsRegExp, '')
      return { 
        removeImportsInContentFile,
        allImports: joinAllImports
      }
    }
    return {removeImportsInContentFile: contentFile, allImports: ''}
  }
  
  static formatComponent(contentFile, props = {}) {
    const dashsEliminated = contentFile
      .replace("<>", "return `")
      .replace("</>", "`");
    const htmlEdited = this.formatHTMLInJS(dashsEliminated);
    const { removeImportsInContentFile, allImports } = this.getAllImports(htmlEdited)
    const allComponentsChanged = this.formatComponentSyntax(removeImportsInContentFile)
    console.log(allComponentsChanged);
    const usingFunction = `
    ${allImports}
    export default async function usingAsyncFunction(props) {
      ${allComponentsChanged}
    }`;

    console.log('*** ALL COMPONENT ***: ', usingFunction);
    return usingFunction 
  }
  
}


