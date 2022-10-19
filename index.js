import http, { Server } from "http";
import { getRoutePaths } from "./utils/getRoutePaths.js";

const host = "localhost";
const port = 8000;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "GET") {
    const allPages = await getRoutePaths("./simulation/pages");
    const myPage = allPages.find((x) => x.url === url && x.type === "file");
    console.log(allPages);
    if (myPage) {
      console.log(myPage);
      res.end(`<h1>${myPage.name}</h1>`);
    } else {
      res.writeHead(404);
    }
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
