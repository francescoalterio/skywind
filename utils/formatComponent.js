import fetch from "node-fetch";

function format(contentFile) {
  if (contentFile.indexOf("<>") !== -1) {
    console.log(contentFile);
    const newContentFile = contentFile.replace("<>", "`").replace("</>", "`");
    console.log(newContentFile);
    return format(newContentFile);
  } else {
    return contentFile;
  }
}

export async function formatComponent(contentFile) {
  let html = "";
  const dashsEliminated = contentFile
    .replace("---", "return `")
    .replace("---", "`");
  const fileEdited = format(dashsEliminated);
  const usingFunction = `async function usingAsyncFunction() {
    ${fileEdited}
  }
  html = usingAsyncFunction()
  `;
  eval(usingFunction);
  console.log(html);
  return html;
}
