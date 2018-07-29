const voting = artifacts.require("./voting.sol")

module.exports = function(deployer) {
	deployer.deploy(voting);
};
