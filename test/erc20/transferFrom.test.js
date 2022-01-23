const Artifact = artifacts.require('../contracts/Coin.sol');
const Assert = require('truffle-assertions');

contract('Coin transferFrom method tests', accounts => {
  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];
  const otherAddress2 = accounts[1];

  let contractInstance;

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
    await contractInstance.mintTo(ownerAddress, 1000);
  });

  it('transferFrom should alert error when from address is invalid', async () => {
    await Assert.reverts(
      contractInstance.transferFrom('0x0000000000000000000000000000000000000000', otherAddress2, 1000, { from: ownerAddress }),
      "ERC20 Error: 'from' address is not valid"
    );
  });

  it('transferFrom should alert error when to address is invalid', async () => {
    await Assert.reverts(
      contractInstance.transferFrom(otherAddress, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
      "ERC20 Error: 'to' address is not valid"
    );
  });

  it('transferFrom should alert error when balance is insufficient', async () => {
    await Assert.reverts(
      contractInstance.transferFrom(otherAddress, otherAddress2, 1000, { from: otherAddress }),
      'Transaction Error: insufficient balance'
    );
  });

  it('transferFrom should alert error when sender is not approved', async () => {
    await Assert.reverts(
      contractInstance.transferFrom(ownerAddress, otherAddress, 1000, { from: ownerAddress }),
      "Transaction Error, 'from' not allowed"
    );
  });

  it('transferFrom should success', async () => {
    await contractInstance.mintTo(ownerAddress, 1000, { from: ownerAddress });
    await contractInstance.approve(otherAddress, 1000, { from: ownerAddress });

    const result = await contractInstance.transferFrom(ownerAddress, otherAddress, 1000, { from: otherAddress });

    Assert.eventEmitted(result, 'Transfer');
  });
});