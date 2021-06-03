const Web3 = require('web3');
const abiAtomicSwapERC20 = require('./build/contracts/AtomicSwapERC20.json');
const abiTokenERC20 = require('./build/contracts/TestERC20.json');

const address = "0xfC5cC5966237734ad1904b6f3F7E27432040a479";
const privateKey = "9cf62be837350e1aa0b6472db460cf2c258b1fcd99962b7e28007be84c06d329";

const lock = "0x261c74f7dd1ed6a069e18375ab2bee9afcb1095613f53b07de11829ac66cdfcc";
const key = "0x42a990655bffe188c9823a2f914641a32dcbb1b28e8586bd29af291db7dcd4e8";

const swapID_swap = "0x0505915948dcd6756a8f5169e9c539b69d87d9a4b8f57cbb40867d9f91790211";
const swapID_expiry = "0xc3b89738306a66a399755e8535300c42b1423cac321938e7fe30b252abf8fe74";
const timeout = 100;
let withdrawTraderAddress = "0x6d9b4120A9AB67c0daA6D30EbF3599d2F72756bB";

const init = async() => {
    console.log('Environment: ', process.env.NODE_ENV);
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');

    const web3 = new Web3(provider);
    const id = await web3.eth.net.getId();
    const deployedAtomicSwapERC20 = abiAtomicSwapERC20.networks[id];
    const deployedTokenERC20 = abiTokenERC20.networks[id];
    const addresses = await web3.eth.getAccounts();
    const ContractAtomicSwapERC20 = new web3.eth.Contract(
        abiAtomicSwapERC20.abi,             // smartContract json data
        deployedAtomicSwapERC20.address     // smartContract address
    );
    console.log('deployedAtomicSwapERC20.address: ', deployedAtomicSwapERC20.address)
    const ContractTokenERC20 = new web3.eth.Contract(
        abiTokenERC20.abi,             // smartContract json data
        deployedTokenERC20.address     // smartContract address
    );
    console.log('deployedTokenERC20.address: ', deployedTokenERC20.address)    
    // const ContractAtomicSwapERC20 = new web3.eth.Contract(abiAtomicSwapERC20, deployedNetwork.address, {
    //     from: address
    // });

    // var myData = myContract.methods.transfer(object.toAddress, web3.utils.toWei(object.value)).encodeABI();
    const tokene_resp = await ContractTokenERC20.methods.approve(deployedAtomicSwapERC20.address, 10000).encodeABI(); 
    console.log('tokene_resp: ', tokene_resp);

    ContractAtomicSwapERC20.methods.open( swapID_swap, 10000, deployedTokenERC20.address, addresses[0], lock, timeout)
    .send({from: addresses[0]})
    .on('receipt', function(receipt) {
        console.log('receipt: ', receipt);
    });


    // const result = await ContractAtomicSwapERC20.methods
    //     .getData()
    //     .call();

    // console.log('result: ', result);
}

init();