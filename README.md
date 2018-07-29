# Simple Election Dapp
The smart contract powering this dapp is [voting.sol](./contracts/voting.sol). It uses [RequestNetwork's Safemath library](https://github.com/RequestNetwork/requestNetwork/blob/master/packages/requestNetworkSmartContracts/contracts/base/math/SafeMathInt.sol) to protect againts overflows for the int256 type, as well as their [Ownable contract](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol) to enable the owner of the contract to delete candidates (which you probably don't want on a real world Election dapp). \
The frontend was made using [Vuejs](https://vuejs.org/), [bootstrap](https://vuejs.org/), [notifyjs](https://notifyjs.jpillora.com/) and (of course) [Web3js](https://github.com/ethereum/web3.js). Note that I used the 1.0.0 beta version of web3js because it allows for ES6 async/await functionality.

## How to use
To interact with the dapp, the [MetaMask](https://metamask.io/) browser extension is required so install it and log in. In order to send transactions you need ether, get some test ether sent to your address [here](http://faucet.ropsten.be:3001/). \
Currently the contract is deployed on the ropsten testnet and you can access the frontend [here](https://rebrand.ly/simpleElectionDapp). 

## Running Locally
With [Truffle](https://truffleframework.com/) you can also run this on a local blockchain, I reccomend [Ganache](https://truffleframework.com/ganache). I'm not going to go over the procedure here, given that there are plenty of tutorials explaining it.

## Testing
I have also written javascript tests to assure the voting contract works as expected. Use `truffle test` to run the voting.js unit test which is under `test/` .
