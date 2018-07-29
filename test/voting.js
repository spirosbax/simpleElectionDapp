var Web3 = require("web3")
var web3 = new Web3()
var voting = artifacts.require("voting")

console.log(web3.version)
contract('Voting', async (accounts) => {
    let instance
    it("should add a new candidate named Trent", async () => {
        instance = await voting.deployed()
        instance.addNewCandidate(web3.utils.fromAscii("Trent"))
        let candidates = await instance.getCandidateList()
        assert.equal(candidates.length, 1, "There are more than one candidates in candidates")
        assert.equal(web3.utils.toUtf8(candidates[0]), "Trent")
    })

    it("should vote once for Trent", async () => {
        await instance.voteForCandidate(web3.utils.fromAscii("Trent"))
        let trentVotes = await instance.getCandidateVotes(web3.utils.fromAscii("Trent"))
        assert.equal(1, trentVotes)
    })
})
