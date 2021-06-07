const EtherSwap = artifacts.require("./AtomicSwapEther.sol");
const ERC20Swap = artifacts.require("./AtomicSwapERC20.sol");
const TestERC20 = artifacts.require("./TestERC20.sol");
const Test2ERC20 = artifacts.require("./Test2ERC20.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherSwap);
  deployer.deploy(ERC20Swap);
  deployer.deploy(TestERC20);
  deployer.deploy(Test2ERC20);
};