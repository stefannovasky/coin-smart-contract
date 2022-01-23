const Artifact = artifacts.require('../contracts/Coin.sol');

contract('Coin balanceOf method tests', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  it('balanceOf should success', async () => {
    const result = await contractInstance.balanceOf(ownerAddress, { from: ownerAddress });

    assert.equal(result.toNumber(), 1000000, 'balance is wrong');
  });
});