const Web3 = require('web3');
const abiAtomicSwapERC20 = require('./build/contracts/AtomicSwapERC20.json');
const abiTokenERC20 = require('./build/contracts/TestERC20.json');

const deployer_address = "0x7Cb62c64d97070f654f5f6899D00AF10842fBcB7";
const privateKey = "9be0a9ca225206d063a0f46671369d8bf61b9b742dc15877a9d595327a97d941";

const lock = "0x261c74f7dd1ed6a069e18375ab2bee9afcb1095613f53b07de11829ac66cdfcc";
const key = "0x42a990655bffe188c9823a2f914641a32dcbb1b28e8586bd29af291db7dcd4e8";

const swapID_swap = "0x0505915948dcd6756a8f5169e9c539b69d87d9a4b8f57cbb40867d9f91790211";
const swapID_expiry = "0xc3b89738306a66a399755e8535300c42b1423cac321938e7fe30b252abf8fe74";
const timeout = 100;
let withdrawTraderAddress = "0x2adfCaC1Ce60F9fF3BFd21f02064fa9Db165167F";

const init = async() => {
    const provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/2b1758a74cf249a598f13e357bb058dc');

    const web3 = new Web3(provider);
    const id = await web3.eth.net.getId();
    const deployedAtomicSwapERC20 = abiAtomicSwapERC20.networks[id];
    const deployedTokenERC20 = abiTokenERC20.networks[id];


    const ContractAtomicSwapERC20 = new web3.eth.Contract(
        abiAtomicSwapERC20.abi,             // smartContract json data
        deployedAtomicSwapERC20.address     // smartContract address
    );
    console.log('deployedAtomicSwapERC20.address: ', deployedAtomicSwapERC20.address)
    const ContractTokenERC20 = new web3.eth.Contract(
        abiTokenERC20.abi,             // smartContract json data
        deployedTokenERC20.address,     // smartContract address
        {from: deployer_address}
    );
    console.log('deployedTokenERC20.address: ', deployedTokenERC20.address)    
    // const ContractAtomicSwapERC20 = new web3.eth.Contract(abiAtomicSwapERC20, deployedNetwork.address, {
    //     from: address
    // });

    //   event Open(bytes32 _swapID, address _withdrawTrader, bytes32 _secretLock);
    //   event Expire(bytes32 _swapID);
    //   event Close(bytes32 _swapID, bytes _secretKey);

    // var myData = myContract.methods.transfer(object.toAddress, web3.utils.toWei(object.value)).encodeABI();
    
    // 1. Approve atomic swap-contract 
    const approveContractAddr = await ContractTokenERC20.methods.approve(deployedAtomicSwapERC20.address, 10000).encodeABI();
    console.log('tokene_resp: ', approveContractAddr);
    // 1.1 Open deal to trader    
    const openDeal = await ContractAtomicSwapERC20.methods.open( swapID_swap, 10000, deployedTokenERC20.address, deployer_address, lock, timeout).encodeABI();
    console.log('openDeal: ', openDeal);

    // 2. Check with swap-id if token-erc20 exist in deal box    
    const checkDeal = await ContractAtomicSwapERC20.methods.check(swapID_swap);
    console.log('checkDeal: ', checkDeal);

    // 3. Close withdraw the token-erc20 from the deal box
    const withdrawFromDealBox = await ContractAtomicSwapERC20.methods.close(swapID_swap, key).encodeABI();
    console.log('withdrawDealBox: ', withdrawFromDealBox);

    // 4. checkSecretKey. Get SecretKey from the Swap-contract
    const secretKey = await ContractAtomicSwapERC20.methods.checkSecretKey(swapID_swap).encodeABI();
    console.log('secretKey: ', secretKey);

    // 5. Expire. Withdraw token-erc20 after expiry
    const withdrawAfterExpiry = await ContractAtomicSwapERC20.methods.expire(swapID_expiry).encodeABI();     
    console.log('withdrawAfterExpiry: ', withdrawAfterExpiry);    
}

init();