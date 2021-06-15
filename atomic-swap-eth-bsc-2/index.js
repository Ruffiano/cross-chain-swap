const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
const abiAtomicSwapERC20 = require('./build/contracts/AtomicSwapERC20.json');
const abiTokenERC20 = require('./build/contracts/TestERC20.json');
const config = require('./config/production.json');

const deployer_address = config.Network.interface.wallet_address;
const privateKey = config.Network.interface.wallet_privateKey;
const withdrawTraderAddress = config.Network.interface.withdrawTraderAddress;
const trader_privateKey = config.Network.interface.trader_privateKey;

// const lock = "0x261c74f7dd1ed6a069e18375ab2bee9afcb1095613f53b07de11829ac66cdfcc"; // hash
// const key = "0x42a990655bffe188c9823a2f914641a32dcbb1b28e8586bd29af291db7dcd4e8"; // seed

// const swapID_swap = "0x0505915948dcd6756a8f5169e9c539b69d87d9a4b8f57cbb40867d9f91790211";
// const swapID_expiry = "0xc3b89738306a66a399755e8535300c42b1423cac321938e7fe30b252abf8fe74";

const lock = "0x9022cd9d270ef1df49a042aa2d2c8d373ca661fb1d3f9f4836276b95424cac08";
const key =  "0xa3388e1f511abb424756b0d5af8fdbbadc6a71b08490e06e50efd35f954d919b";

const swapID_swap =   "0x5e57f701ff8e5e1684670e48074addc1b05cf71aa19dcf9fe8bede8e7a4786eb";
const swapID_expiry = "0xa79ef81d2d11ce153be1907faad0d204636ea36a8b21ff161cf10cb463ef23ea";


const timeout = 100;

const AtomicSwapERC20Address = config.Network.interface.atomic_swaperc20_address;
const TestERC20Address = config.Network.interface.testerc20_address;

const provider = new Web3.providers.HttpProvider(config.Network.interface.network_url);

const web3 = new Web3(provider);

const ContractAtomicSwapERC20 = new web3.eth.Contract(
    abiAtomicSwapERC20.abi, AtomicSwapERC20Address         
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
    const approveContractAddr = await ContractTokenERC20.methods.approve(AtomicSwapERC20Address, web3.utils.toWei('10')).encodeABI();
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

    const openDeal = await ContractAtomicSwapERC20.methods.open(swapID_swap, web3.utils.toWei('10'), TestERC20Address, withdrawTraderAddress, lock, timeout).encodeABI();
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
                    data: withdrawFromDealBox
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


const expire = async() => {
    // ContractAtomicSwapERC20.methods.checkSecretKey(swapID_swap).call(deployer_address, function(err, secretkey) {
    //     console.log('secretkey: ', secretkey);
    //     console.log('secretkey - err: ', err); 
    // });

    setTimeout(async () => {
    const withdrawAfterExpiry = await ContractAtomicSwapERC20.methods.expire(swapID_swap).encodeABI();     
    console.log('withdrawAfterExpiry: ', withdrawAfterExpiry);   

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
                        data: withdrawAfterExpiry
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

    }, 100*5);  
}


// approve();

// open();

// close();

// expire();
