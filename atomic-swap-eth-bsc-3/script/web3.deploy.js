const Web3 = require('web3');

const AtomicSwapERC20 = require('../artifacts/contracts/AtomicSwapERC20.sol/AtomicSwapERC20.json');
const AtomicSwapEther = require('../artifacts/contracts/AtomicSwapEther.sol/AtomicSwapEther.json');
const TestERC20 = require('../artifacts/contracts/TestERC20.sol/TestERC20.json');
const Test2ERC20 = require('../artifacts/contracts/Test2ERC20.sol/Test2ERC20.json');

const config = require('../config/development.json');

const deployer_address = config.Network.interface.wallet_address;
const privateKey = config.Network.interface.wallet_privateKey;

const provider = new Web3.providers.HttpProvider(config.Network.interface.network_url);
const web3 = new Web3(provider);

const ContractAtomicSwapERC20 = async() => {
    console.log('Attempting to deploy from account:', deployer_address);
    const incrementer = new web3.eth.Contract(AtomicSwapERC20.abi);
    const incrementerTx = incrementer.deploy({
          data: AtomicSwapERC20.bytecode,
          arguments: [5],
       });
    const createTransaction = await web3.eth.accounts.signTransaction (
          {
             from: deployer_address,
             data: incrementerTx.encodeABI(),
             gas: 5500000,
          },
          privateKey
       );
    const createReceipt = await web3.eth.sendSignedTransaction(
          createTransaction.rawTransaction
       );
       console.log('Contract AtomicSwapERC20: ', createReceipt.contractAddress);
       return createReceipt; 
}

const ContractAtomicSwapEther = async() => {
    console.log('Attempting to deploy from account:', deployer_address);
    const incrementer = new web3.eth.Contract(AtomicSwapEther.abi);
    const incrementerTx = incrementer.deploy({
          data: AtomicSwapEther.bytecode,
          arguments: [5],
       });
    const createTransaction = await web3.eth.accounts.signTransaction (
          {
             from: deployer_address,
             data: incrementerTx.encodeABI(),
             gas: 5500000,
          },
          privateKey
       );
    const createReceipt = await web3.eth.sendSignedTransaction (
          createTransaction.rawTransaction
       );
    console.log('Contract AtomicSwapEther: ', createReceipt.contractAddress);
    return createReceipt;
}

const ContractTestERC20 = async() => {
    console.log('Attempting to deploy from account:', deployer_address);
    const incrementer = new web3.eth.Contract(TestERC20.abi);
    const incrementerTx = await incrementer.deploy({
          data: TestERC20.bytecode
       });
    const createTransaction = await web3.eth.accounts.signTransaction (
          {
             from: deployer_address,
             data: incrementerTx.encodeABI(),
             gas: 5500000,
          },
          privateKey
       );
    const createReceipt = await web3.eth.sendSignedTransaction (
          createTransaction.rawTransaction
       );
    console.log('Contract TestERC20: ', createReceipt.contractAddress);
    return createReceipt;
}

const ContractTest2ERC20 = async() => {
    console.log('Attempting to deploy from account:', deployer_address);
    const incrementer = new web3.eth.Contract(Test2ERC20.abi);
    const incrementerTx = incrementer.deploy({
          data: Test2ERC20.bytecode,
       });
    const createTransaction = await web3.eth.accounts.signTransaction (
          {
             from: deployer_address,
             data: incrementerTx.encodeABI(),
             gas: 5500000,
          },
          privateKey
       );
    const createReceipt = await web3.eth.sendSignedTransaction (
          createTransaction.rawTransaction
       );
    console.log('Contract Test2ERC20: ', createReceipt.contractAddress);
    return createReceipt;
}

// ContractAtomicSwapERC20();
// ContractAtomicSwapEther();
// ContractTestERC20();
// ContractTest2ERC20();
