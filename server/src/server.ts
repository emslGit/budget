const fs = require("fs");

const server = require("http2").createSecureServer(
  {
    key: fs.readFileSync("localhost-privkey.pem"),
    cert: fs.readFileSync("localhost-cert.pem")
  },
);

server.listen(8443);