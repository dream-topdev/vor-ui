// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@unification-com/xfund-vor/contracts/VORConsumerBase.sol";

/** ****************************************************************************
 * @notice Extremely simple Distrubution using VOR
 * *****************************************************************************
 *
 */
contract XYDistribution is Ownable, VORConsumerBase {
    using SafeMath for uint256;

    // keep track of the monsters
    uint256 public nextDistributionId;

    enum DataType { ZERO, ONE_TO_ONE_MAPPING, X_FROM_Y }
    
    // user request
    struct Distribution {
        string ipfs;
        uint256 sourceCount;
        uint256 destCount;
        DataType dataType;
        bytes32 keyHash;
        uint256 fee;
        uint256 seed;
        uint256 result;
    }

    // distribution held in the contract
    mapping (uint256 => Distribution) public distributions;

    // map request IDs to distribution IDs
    mapping(bytes32 => uint256) public requestIdToDistributionId;
    mapping(bytes32 => address) public requestIdToAddress;
    mapping(address => string) public monikers;
    
    // Some useful events to track
    event NewMoniker(address requester, string moniker);
    event StartingDistribute(uint256 distID, bytes32 requestID, address sender, string ipfs, uint256 sourceCount, uint256 destCount, DataType dataType, uint256 seed, bytes32 keyHash, uint256 fee);
    event DistributeResult(uint256 distID, bytes32 requestID, address sender, uint256 beginIndex, uint256 sourceCount, uint256 destCount, DataType dataType);

    /**
    * @notice Constructor inherits VORConsumerBase
    *
    * @param _vorCoordinator address of the VOR Coordinator
    * @param _xfund address of the xFUND token
    */
    constructor(address _vorCoordinator, address _xfund)
    public
    VORConsumerBase(_vorCoordinator, _xfund) {
        nextDistributionId = 1;
    }

    /**
    * @notice startDistribute anyone can call to distribute x items to y items. Caller (msg.sender)
    * pays the xFUND fees for the request.
    *
    * @param _ipfs string of the IPFS ID
    * @param _sourceCount uint256 of source count
    * @param _destCount uint256 of dest count
    * @param _dataType uint256 of distribution type
    * @param _seed uint256 seed for the randomness request. Gets mixed in with the blockhash of the block this Tx is in
    * @param _keyHash bytes32 key hash of the provider caller wants to fulfil the request
    * @param _fee uint256 required fee amount for the request
    */
    function startDistribute(string memory _ipfs, uint256 _sourceCount, uint256 _destCount, DataType _dataType, uint256 _seed, bytes32 _keyHash, uint256 _fee) external returns (bytes32 requestId) {
        require(bytes(monikers[msg.sender]).length != 0, "not registered address");
        require(_sourceCount > 0, "invalid source count");
        require(_destCount > 0, "invalid destination count");
        require(_dataType == DataType.ONE_TO_ONE_MAPPING || _dataType == DataType.X_FROM_Y, "invalid dataType");
        distributions[nextDistributionId].ipfs = _ipfs;
        distributions[nextDistributionId].sourceCount = _sourceCount;
        distributions[nextDistributionId].destCount = _destCount;
        distributions[nextDistributionId].dataType = _dataType;
        distributions[nextDistributionId].fee = _fee;
        distributions[nextDistributionId].keyHash = _keyHash;
        distributions[nextDistributionId].seed = _seed;
        // Note - caller must have increased xFUND allowance for this contract first.
        // Fee is transferred from msg.sender to this contract. The VORCoordinator.requestRandomness
        // function will then transfer from this contract to itself.
        // This contract's owner must have increased the VORCoordnator's allowance for this contract.
        xFUND.transferFrom(msg.sender, address(this), _fee);
        requestId = requestRandomness(_keyHash, _fee, _seed);
        emit StartingDistribute(nextDistributionId, requestId, msg.sender, _ipfs, _sourceCount, _destCount, _dataType, _seed, _keyHash, _fee);
        requestIdToAddress[requestId] = msg.sender;
        requestIdToDistributionId[requestId] = nextDistributionId;
        nextDistributionId = nextDistributionId.add(1);
        return requestId;
    }

    /**
     * @notice Callback function used by VOR Coordinator to return the random number
     * to this contract.
     * @dev The random number is used to simulate distribution starting index. Result is emitted as follows:
     *
     * @param _requestId bytes32
     * @param _randomness The random result returned by the oracle
     */
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        uint256 distId = requestIdToDistributionId[_requestId];
        address player = requestIdToAddress[_requestId];
        Distribution memory dist = distributions[distId];
        uint256 sourceCount = dist.sourceCount;
        uint256 beginIndex = _randomness.mod(sourceCount);
        distributions[distId].result = beginIndex;
        emit DistributeResult(distId, _requestId, player, beginIndex, dist.sourceCount, dist.destCount, dist.dataType);

        // clean up
        delete requestIdToDistributionId[_requestId];
        delete requestIdToAddress[_requestId];
    }

    /**
     * @notice register moniker of each address
     * emits the NewMoniker event
     * @param _moniker string moniker to be registered max 32 characters
     */
    function registerMoniker(string memory _moniker) external {
        require(bytes(_moniker).length <= 32, "can't exceed 32 characters");
        monikers[msg.sender] = _moniker;
        emit NewMoniker(msg.sender, _moniker);
    }

    /**
     * @notice get moniker of sender
     */
    function getMoniker() external view returns (string memory)  {
        return monikers[msg.sender];
    }

    /**
     * @notice Example wrapper function for the VORConsumerBase increaseVorCoordinatorAllowance function.
     * @dev Wrapped around an Ownable modifier to ensure only the contract owner can call it.
     * @dev Allows contract owner to increase the xFUND allowance for the VORCoordinator contract
     * @dev enabling it to pay request fees on behalf of this contract.
     *
     * @param _amount uint256 amount to increase allowance by
     */
    function increaseVorAllowance(uint256 _amount) external onlyOwner {
        _increaseVorCoordinatorAllowance(_amount);
    }

    /**
     * @notice Example wrapper function for the VORConsumerBase withdrawXFUND function.
     * Wrapped around an Ownable modifier to ensure only the contract owner can call it.
     * Allows contract owner to withdraw any xFUND currently held by this contract
     */
    function withdrawToken(address to, uint256 value) external onlyOwner {
        require(xFUND.transfer(to, value), "Not enough xFUND");
    }

    /**
     * @notice Example wrapper function for the VORConsumerBase _setVORCoordinator function.
     * Wrapped around an Ownable modifier to ensure only the contract owner can call it.
     * Allows contract owner to change the VORCoordinator address in the event of a network
     * upgrade.
     */
    function setVORCoordinator(address _vorCoordinator) external onlyOwner {
        _setVORCoordinator(_vorCoordinator);
    }

    /**
     * @notice returns the current VORCoordinator contract address
     * @return vorCoordinator address
     */
    function getVORCoordinator() external view returns (address) {
        return vorCoordinator;
    }
}
