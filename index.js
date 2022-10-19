import http, { Server } from "http";
import { formatComponent } from "./utils/formatComponent.js";
import { getFileContent } from "./utils/getFileContent.js";
import { getRoutePaths } from "./utils/getRoutePaths.js";

const host = "localhost";
const port = 8000;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "GET") {
    const allPages = await getRoutePaths("./simulation/pages");
    const myPage = allPages.find((x) => x.url === url && x.type === "file");
    if (myPage) {
      const contentPage = await getFileContent(myPage.path);
      const html = await formatComponent(contentPage);
      console.log(html);
      res.writeHeader(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
    } else {
      const contentPage = await getFileContent("./simulation/pages/404.js");
      res.end(contentPage);
    }
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
