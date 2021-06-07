const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const AtomicSwapERC20 = require('./build/contracts/AtomicSwapERC20.json');
const AtomicSwapEther = require('./build/contracts/AtomicSwapEther.json');
const TestERC20 = require('./build/contracts/TestERC20.json');
const Test2ERC20 = require('./build/contracts/Test2ERC20.json');

const deployer_address = '';
const privateKey = '';

const init = async() => {
    const provider = new HDWalletProvider(
        privateKey,
        'https://ropsten.infura.io/v3/2b1758a74cf249a598f13e357bb058dc'
    );

    const web3 = new Web3(provider);
    
    console.log('Attempting to deploy from account:', address);
    const incrementer = new web3.eth.Contract(abi);
    const incrementerTx = incrementer.deploy({
          data: bytecode,
          arguments: [5],
       });
    const createTransaction = await web3.eth.accounts.signTransaction(
          {
             from: address,
             data: incrementerTx.encodeABI(),
             gas: '4294967295',
          },
          privKey
       );
    const createReceipt = await web3.eth.sendSignedTransaction(
          createTransaction.rawTransaction
       );
       console.log('Contract deployed at address', createReceipt.contractAddress);

}

init();



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