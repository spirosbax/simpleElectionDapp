pragma solidity ^0.4.23;

import "./safemathint.sol";
import "./ownable.sol";

// TODO maybe add modifier so that a candidate cannot vote himself
// TODO safemath for uint and int

/// @title Simple voting dapp
/// @author spirosbax
contract voting is Ownable {
    using SafeMathInt for int256;

    /* this is where we store our candidates and match the with ids
    it is public so everyone can see every candidates votes,
    we get automatic get methods, eg. candidateToVotes(2) will return the Candidate with id = 2 */
    mapping(bytes32 => int256) private candidateToVotes;
    bytes32[] public candidates;

    event NewCandidateAdded(bytes32 _name);
    event VotedCandidate(bytes32 _name);
    event DeletedCandidate(bytes32 _name);

    modifier candidateExists(bytes32 _name) {
        require((candidateToVotes[_name] == -1) || (candidateToVotes[_name] > 0)); // check if candidate exists
        _;
    }

    /// add new Candidate
    /// @param _name the name of the new Candidate
    /// @dev anyone can add a new Candidate
    function addNewCandidate(bytes32 _name) public {
        _addNewCandidate(_name);
    }

    /// internal function for adding a candidate
    /// @param _name the name of the Candidate to be added
    /// @dev fires an NewCandidateAdded event
    function _addNewCandidate(bytes32 _name) internal {
        require(candidateToVotes[_name] == 0); // check that candidate has not already been added
        candidateToVotes[_name] = -1;
        candidates.push(_name);
        emit NewCandidateAdded(_name);
    }

    /// vote for a Candidate, anyone can vote for a Candidate
    /// @param _name the id of the Candidate to be voted
    /// @dev throws event VotedCandidate

    // TODO add a way for the callee to pay so the data can be written to the blockchain
    function voteForCandidate(bytes32 _name) public {
        _voteForCandidate(_name);
    }

    function _voteForCandidate(bytes32 _name) internal candidateExists(_name) {
        if (candidateToVotes[_name] == -1) {
            candidateToVotes[_name] = candidateToVotes[_name].add(2);
        } else {
            candidateToVotes[_name] = candidateToVotes[_name].add(1);
        }
        emit VotedCandidate(_name);
    }


    /// deletes a candidate, only owner can delete candidates
    /// @param _name the id of the Candidate to be deleted
    /// @dev throws event DeletedCandidate
    function deleteCandidate(bytes32 _name) public onlyOwner {
        _deleteCandidate(_name);
    }

    function _deleteCandidate(bytes32 _name) internal candidateExists(_name) {
        candidateToVotes[_name] = -2;
        for(uint256 i = 0; i < candidates.length; i++) {
            if(keccak256(candidates[i]) == keccak256(_name)) {
                delete candidates[i];
            }
        }
        emit DeletedCandidate(_name);
    }

    /// returns the votes of candidate with id _name
    /// @param _name the id of the candidate
    function getCandidateVotes(bytes32 _name) view external candidateExists(_name) returns (int){
        if (candidateToVotes[_name] == -1) {
            return 0;
        }
        return candidateToVotes[_name];
    }

    /// returns list of candidates
    function getCandidateList() view external returns (bytes32[]) {
        return candidates;
    }
}

