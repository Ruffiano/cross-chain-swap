var ERC20 = artifacts.require("./AtomicSwapERC20.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC20);
};