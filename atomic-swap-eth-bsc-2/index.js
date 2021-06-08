const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
const abiAtomicSwapERC20 = require('./build/contracts/AtomicSwapERC20.json');
const abiTokenERC20 = require('./build/contracts/TestERC20.json');
const config = require('./config/production.json');

const deployer_address = config.Network.interface.wallet_address;
const privateKey = config.Network.interface.wallet_privateKey;
const withdrawTraderAddress = config.Network.interface.withdrawTraderAddress;
const trader_privateKey = config.Network.interface.trader_privateKey;

// const lock = "0x261c74f7dd1ed6a069e18375ab2bee9afcb1095613f53b07de11829ac66cdfcc";
// const key = "0x42a990655bffe188c9823a2f914641a32dcbb1b28e8586bd29af291db7dcd4e8";

// const swapID_swap = "0x0505915948dcd6756a8f5169e9c539b69d87d9a4b8f57cbb40867d9f91790211";
// const swapID_expiry = "0xc3b89738306a66a399755e8535300c42b1423cac321938e7fe30b252abf8fe74";

const lock = "0x9bf3940003fe6839537fd7467023db9715c3f0b0de5ca38eafc394f2a3407511";
const key = "0x3da33ef5ee2836d4248c7dd66a99098e72f8f54f355e38fcdc13eee501f9969e";

const swapID_swap = "0xa784c555b3204b28b9720e5204b7377e71564617a8b586ee64bc602b8aead9d1";
const swapID_expiry = "0xbb1556da2abf0f29379cddb06ebb4b78830adde1cf19a546eea0641ce1034490";


const timeout = 100;

const AtomicSwapERC20Address = '0xd92B9a44faB4F1295402564361eeD19e2bEaF52A';
const TestERC20Address = '0x08bd9FD97Adcf202B4BBF8f97A5B01337Cf171A4';

const provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/2b1758a74cf249a598f13e357bb058dc');

const web3 = new Web3(provider);

const ContractAtomicSwapERC20 = new web3.eth.Contract(
    abiAtomicSwapERC20.abi,             // smartContract json data
    AtomicSwapERC20Address          // smartContract address
);

const ContractTokenERC20 = new web3.eth.Contract(abiTokenERC20.abi, TestERC20Address, {
    from: deployer_address
});

const init = async() => {
    
    // 1. Approve atomic swap-contract 
    const approveContractAddr = await ContractTokenERC20.methods.approve(AtomicSwapERC20Address, 10000).encodeABI();
    console.log('tokene_resp: ', approveContractAddr);
    // 1.1 Open deal to trader    
    const openDeal = await ContractAtomicSwapERC20.methods.open( swapID_swap, 10000, TestERC20Address, deployer_address, lock, timeout).encodeABI();
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

const approve = async() => {
    const approveContractAddr = await ContractTokenERC20.methods.approve(AtomicSwapERC20Address, web3.utils.toWei('10000')).encodeABI();
    console.log('tokene_resp: ', approveContractAddr);

    return  new Promise(
        (resolve, reject) => {
            web3.eth.getTransactionCount(deployer_address, (err, txCount) => {
                console.log('getTransactionCount Err: ', err);
                // // Build the transaction
                let txObject = {
                    from: deployer_address,
                    nonce: web3.utils.toHex(txCount),
                    to: TestERC20Address,
                    value: '0x0',
                    gasLimit: web3.utils.toHex('2100000'),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
                    // gasLimit: "0x7458",
                    // gasPrice: "0x04e3b29200",
                    data: approveContractAddr
                };
                // console.log('txObject: ', txObject);
                if(privateKey.includes('0x')) {
                    privateKey = privateKey.slice(2, privateKey.length);
                    console.log('privateKey:  ', privateKey);
                }
                // privateKey = Buffer.from(privateKey, 'hex');
                // Sign the transaction
                const tx = new Tx(txObject, {chain: 'ropsten'});
                tx.sign(Buffer.from(privateKey, 'hex'));

                const serializedTx = tx.serialize();
                console.log('serializedTx: ', serializedTx);
                var raw = '0x' + serializedTx.toString('hex');
                console.log('RAW: ', raw);
                web3.eth.sendSignedTransaction(raw)
                    .on('receipt', function (tx) {
                        console.log('receipt: ', tx.transactionHash);
                        resolve(tx.transactionHash);
                    });
            });
        }
    );
}


const open = async() => {

    const openDeal = await ContractAtomicSwapERC20.methods.open( swapID_swap, web3.utils.toWei('10000'), TestERC20Address, withdrawTraderAddress, lock, timeout).encodeABI();
    console.log('openDeal: ', openDeal);

    return  new Promise(
        (resolve, reject) => {
            web3.eth.getTransactionCount(deployer_address, (err, txCount) => {
                console.log('getTransactionCount Err: ', err);
                // // Build the transaction
                let txObject = {
                    from: deployer_address,
                    nonce: web3.utils.toHex(txCount),
                    to: AtomicSwapERC20Address,
                    value: '0x0',
                    gasLimit: web3.utils.toHex('2100000'),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
                    // gasLimit: "0x7458",
                    // gasPrice: "0x04e3b29200",
                    data: openDeal
                };
                // console.log('txObject: ', txObject);
                if(privateKey.includes('0x')) {
                    privateKey = privateKey.slice(2, privateKey.length);
                    console.log('privateKey:  ', privateKey);
                }
            

                const tx = new Tx(txObject, {chain: 'ropsten'});
                tx.sign(Buffer.from(privateKey, 'hex'));

                const serializedTx = tx.serialize();
                console.log('serializedTx: ', serializedTx);
                var raw = '0x' + serializedTx.toString('hex');
                console.log('RAW: ', raw);
                web3.eth.sendSignedTransaction(raw)
                    .on('receipt', function (tx) {
                        console.log('receipt: ', tx.transactionHash);
                        resolve(tx.transactionHash);
                    });
            });
        }
    );
}

const close = async() => {

    const withdrawFromDealBox = await ContractAtomicSwapERC20.methods.close(swapID_swap, key).encodeABI();
    console.log('withdrawDealBox: ', withdrawFromDealBox);

    return  new Promise(
        (resolve, reject) => {
            web3.eth.getTransactionCount(deployer_address, (err, txCount) => {
                console.log('getTransactionCount Err: ', err);
                // // Build the transaction
                let txObject = {
                    from: deployer_address,
                    nonce: web3.utils.toHex(txCount),
                    to: AtomicSwapERC20Address,
                    value: '0x0',
                    gasLimit: web3.utils.toHex('2100000'),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
                    // gasLimit: "0x7458",
                    // gasPrice: "0x04e3b29200",
                    data: withdrawFromDealBox
                };
                // console.log('txObject: ', txObject);
                if(privateKey.includes('0x')) {
                    privateKey = privateKey.slice(2, privateKey.length);
                    console.log('privateKey:  ', privateKey);
                }
                // privateKey = Buffer.from(privateKey, 'hex');
                // Sign the transaction
                const tx = new Tx(txObject, {chain: 'ropsten'});
                tx.sign(Buffer.from(privateKey, 'hex'));

                const serializedTx = tx.serialize();
                console.log('serializedTx: ', serializedTx);
                var raw = '0x' + serializedTx.toString('hex');
                console.log('RAW: ', raw);
                web3.eth.sendSignedTransaction(raw)
                    .on('receipt', function (tx) {
                        console.log('receipt: ', tx.transactionHash);
                        resolve(tx.transactionHash);
                    });
            });
        }
    );
}


const expire = async() => {

    const withdrawAfterExpiry = await ContractAtomicSwapERC20.methods.expire(swapID_expiry).encodeABI();     
    console.log('withdrawAfterExpiry: ', withdrawAfterExpiry);   

    return  new Promise(
        (resolve, reject) => {
            web3.eth.getTransactionCount(withdrawTraderAddress, (err, txCount) => {
                console.log('getTransactionCount Err: ', err);
                // // Build the transaction
                let txObject = {
                    from: withdrawTraderAddress,
                    nonce: web3.utils.toHex(txCount),
                    to: AtomicSwapERC20Address,
                    value: '0x0',
                    gasLimit: web3.utils.toHex('2100000'),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
                    // gasLimit: "0x7458",
                    // gasPrice: "0x04e3b29200",
                    data: withdrawAfterExpiry
                };
                // console.log('txObject: ', txObject);
                if(trader_privateKey.includes('0x')) {
                    trader_privateKey = trader_privateKey.slice(2, trader_privateKey.length);
                    console.log('privateKey:  ', trader_privateKey);
                }
                // privateKey = Buffer.from(privateKey, 'hex');
                // Sign the transaction
                const tx = new Tx(txObject, {chain: 'ropsten'});
                tx.sign(Buffer.from(trader_privateKey, 'hex'));

                const serializedTx = tx.serialize();
                console.log('serializedTx: ', serializedTx);
                var raw = '0x' + serializedTx.toString('hex');
                console.log('RAW: ', raw);
                web3.eth.sendSignedTransaction(raw)
                    .on('receipt', function (tx) {
                        console.log('receipt: ', tx.transactionHash);
                        resolve(tx.transactionHash);
                    });
            });
        }
    );
}




// approve();

// open();

close();

// expire();
