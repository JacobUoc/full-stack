const http = require("http");

const { Player, GameRoom } = require("./models");

const users = [];
const rooms = [];

const server = http.createServer((req, res) => {
  if (req.url === "/register") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const user = JSON.parse(body);
      user.id = Date.now();
      users.push(user);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success", user }));
    });
  } else if (req.url === "/login") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { email, password } = JSON.parse(body);
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "success", user }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "error", message: "Incorrect email or password." }));
      }
    });
  } else if (req.url === "/rooms") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rooms));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: "Not found." }));
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

