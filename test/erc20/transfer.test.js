const Artifact = artifacts.require('../contracts/Coin.sol');
const Assert = require('truffle-assertions');

contract('Coin transfer method tests', accounts => {
  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];

  let contractInstance;

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
    await contractInstance.mintTo(ownerAddress, 1000);
  });

  it('transfer method should alert error when address is invalid', async () => {
    const invalidAddress = '0x0000000000000000000000000000000000000000';
    await Assert.reverts(
      contractInstance.transfer(invalidAddress, 1000, { from: ownerAddress }),
      'ERC20 Error: Address is not valid'
    );
  });

  it('transfer method should alert error when balance is insufficient', async () => {
    await Assert.reverts(
      contractInstance.transfer(ownerAddress, 1000, { from: otherAddress }),
      'Transaction Error: insufficient balance'
    );
  });

  it('transfer method success', async () => {
    const result = await contractInstance.transfer(otherAddress, 1000, { from: ownerAddress });

    Assert.eventEmitted(result, 'Transfer');
  });
});