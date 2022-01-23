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

  const setAccountBalance = async (address, amount) => {
    await contractInstance.mintTo(address, amount);
  };

  it('balanceOf should success', async () => {
    await setAccountBalance(ownerAddress, 100);

    const result = await contractInstance.balanceOf(ownerAddress, { from: ownerAddress });

    assert.equal(result.toNumber(), 100, 'balance is wrong');
  });
});