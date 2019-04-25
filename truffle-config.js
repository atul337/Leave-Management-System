const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks: {
    ganache: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "5777",
    },
    testing: {
        host: "172.16.186.128",
        port: 7545,
        network_id: "5777",
    }
  }
};
  