import http, { Server } from "http";
import ComponentFormatter from "./utils/ComponentFormatter.js";
import { getFileContent } from "./utils/getFileContent.js";
import { getRoutePaths } from "./utils/getRoutePaths.js";

export default class Skywind {
  static createApp(host = 'localhost', port = 8000) {
    const server = http.createServer(async (req, res) => {
      const { method, url } = req;
      
      if(url.indexOf('/api') === 0) {
        const allEndpoints = await getRoutePaths("pages/api");
        console.log(allEndpoints);
        const myEndpoint = allEndpoints.find((x) => {
          const newUrl = url.replace('/api', '')
          console.log('erwe', x.url);
          if(x.url === '/' && newUrl === '' && x.type === "file") return true
          return x.url === newUrl && x.type === "file"
        });
        if(myEndpoint) {
          const {default: apiFunction} = await import(`../../${myEndpoint.path}`);
          apiFunction(req, res);
          return;
        }
      } else if (method === "GET" && url.indexOf('/api') === -1) {
        const allPages = await getRoutePaths("pages");
        const myPage = allPages.find((x) => x.url === url && x.type === "file");
        if (myPage) {
          const contentPage = await getFileContent(myPage.path);
          const html = await ComponentFormatter.formatComponent(contentPage);
          console.log(html);
          res.writeHeader(200, { "Content-Type": "text/html" });
          res.write(html);
          res.end();
        } else {
          const contentPage = await getFileContent("pages/404.js");
          const html = await ComponentFormatter.formatComponent(contentPage);
          res.writeHeader(404, { "Content-Type": "text/html" });
          res.write(html);
          res.end();
        }
      }
    });
  
      
  
    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  }

  static importComponent(path) {
    return async function (props) {
      console.log(path);
      const contentPage = await getFileContent(`.${path}`);
      const html = await ComponentFormatter.formatComponent(contentPage, props);
      return html
    }
  }
  
  static async importStylesheet(path) {
    const contentPage = await getFileContent(`.${path}`);
    return contentPage
  }
}


