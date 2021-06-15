const Web3 = require('web3');

const AtomicSwapERC20 = require('./build/contracts/AtomicSwapERC20.json');
const AtomicSwapEther = require('./build/contracts/AtomicSwapEther.json');
const TestERC20 = require('./build/contracts/TestERC20.json');
const Test2ERC20 = require('./build/contracts/Test2ERC20.json');

const config = require('./config/production.json');

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


    // let contractAtomicSwapERC20 = new web3.eth.Contract(
    //     AtomicSwapERC20.abi
    // )
    
    // contractAtomicSwapERC20 = await contractAtomicSwapERC20
    //     .deploy({data: AtomicSwapERC20.bytecode})
    //     .send({from: deployer_address});

    // console.log('1 - contractAtomicSwapERC20 ->', contractAtomicSwapERC20);



    // let contractAtomicSwapEther = new web3.eth.Contract(
    //     AtomicSwapERC20.abi
    // )
    
    // contractAtomicSwapEther = await contractAtomicSwapEther
    //     .deploy({data: AtomicSwapEther.bytecode})
    //     .send({from: deployer_address});   
        
    // console.log('2 - contractAtomicSwapEther ->', contractAtomicSwapEther);



    // let contractTestERC20 = new web3.eth.Contract(
    //     AtomicSwapERC20.abi
    // )
    
    // contractTestERC20 = await contractTestERC20
    //     .deploy({data: TestERC20.bytecode})
    //     .send({from: deployer_address});   
        
    // console.log('3- contractTestERC20 ->', contractTestERC20);



    // let contractTest2ERC20 = new web3.eth.Contract(
    //     AtomicSwapERC20.abi
    // )
    
    // contractTest2ERC20 = await contractTest2ERC20
    //     .deploy({data: Test2ERC20.bytecode})
    //     .send({from: deployer_address});   
        
    // console.log('4 - contractTest2ERC20 ->', contractTest2ERC20);