/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
   solidity: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
   },
   defaultNetwork: "rinkeby",
   etherscan: {
      apiKey: "72SG7NUKFX9QWHGWSEWVKCR2IP51QXM1GW",
   },
   networks: {
      hardhat: {},
      rinkeby: {
         url: API_URL,
         accounts: [PRIVATE_KEY]
      }
   },
}


