const Artifact = artifacts.require('../contracts/Coin.sol');
const Assert = require('truffle-assertions');

contract('Coin approve method tests', accounts => {
  let contractInstance;

  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  it('approve should success', async () => {
    const result = await contractInstance.approve(otherAddress, 1000, { from: ownerAddress });

    Assert.eventEmitted(result, 'Approval');
  });
});