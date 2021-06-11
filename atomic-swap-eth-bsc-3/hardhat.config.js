/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.5.1",
  networks: {
    hardhat: {
      chainId: 1337
    },
  }
};
