const { expect } = require('chai');

describe('AtomicSwapERC20 contract', () => {
  let AtomicSwapERC20, TestERC20, swap, token, owner, addr1, addr2;

// const lock = "0x261c74f7dd1ed6a069e18375ab2bee9afcb1095613f53b07de11829ac66cdfcc";
// const key = "0x42a990655bffe188c9823a2f914641a32dcbb1b28e8586bd29af291db7dcd4e8";

// const swapID_swap = "0x0505915948dcd6756a8f5169e9c539b69d87d9a4b8f57cbb40867d9f91790211";
// const swapID_expiry = "0xc3b89738306a66a399755e8535300c42b1423cac321938e7fe30b252abf8fe74";



const lock = "0xd9a2bd18482392abcb3c83ceac7afed7628ea980f44a867ac62298a76c4f6fb7";
const key = "0x3da33ef5ee2836d4248c7dd66a99098e72f8f54f355e38fcdc13eee501f9969a";

const swapID_swap = "0xa784c555b3204b28b9720e5204b7377e71564617a8b586ee64bc602b8aead9d2";
const swapID_expiry = "0xbb1556da2abf0f29379cddb06ebb4b78830adde1cf19a546eea0641ce1034492";

  before(async () => {
    AtomicSwapERC20 = await ethers.getContractFactory('AtomicSwapERC20');
    TestERC20 = await ethers.getContractFactory('TestERC20');
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    swap = await AtomicSwapERC20.deploy();
    token = await TestERC20.deploy();
  });

  describe('approve', () => {

    it('Deposit erc20 tokens into the contract', async function () {
        const timeout = 100; // seconds
        await token.approve(swap.address, 10000);
        await swap.open(swapID_swap, 10000, token.address, addr2.address, lock, timeout, {from: owner.address})
    })

    it("Check the erc20 tokens in the lock box", async () => {
      const result  = await swap.check(swapID_swap);
      expect(result[1].toNumber()).to.equal(10000);
      expect(result[2].toString()).to.equal(token.address);
      expect(result[3].toString()).to.equal(addr2.address);
      expect(result[4].toString()).to.equal(lock);
    })

    it("Withdraw the erc20 tokens from the lockbox", async () => {
      await swap.close(swapID_swap, key);
    })
    
    it("Get secret key from the contract", async () => {
      const secretkey = await swap.checkSecretKey(swapID_swap, {from: owner.address});
      console.log('secretkey: ', secretkey);
      // expect(secretkey.toString()).to.equal(key);
    });

    it("Withdraw after expiry", async () => {
      setTimeout(async () => {
        await swap.expire(swapID_expiry, {from: owner.address});
      }, 50000)
    })

  });
});