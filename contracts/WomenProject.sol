// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MulheresSA
 * @dev Sistema de doações para projetos femininos com NFTs
 */
contract MulheresSA is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI = "ipfs://QmMSA/";

    enum Category {
        ECO,
        EDU,
        SAU,
        VIO,
        LID,
        EMP
    }
    struct Project {
        address org;
        string name;
        string desc;
        Category cat;
        uint256 target;
        uint256 raised;
        uint256 deadline;
        bool active;
        uint256 donors;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 time;
        uint256 nftId;
    }

    uint256 public projectCount;
    uint256 public totalRaised;

    mapping(uint256 => Project) public projects;
    mapping(uint256 => Donation[]) public donations;
    mapping(address => uint256[]) public userProjects;
    mapping(address => uint256) public userTotal;

    event ProjectCreated(uint256 indexed id, address indexed org, string name);
    event DonationMade(
        uint256 indexed id,
        address indexed donor,
        uint256 amount,
        uint256 nft
    );
    event Withdrawn(uint256 indexed id, address indexed org, uint256 amount);

    modifier onlyProjectOwner(uint256 id) {
        require(projects[id].org == msg.sender, "Not owner");
        _;
    }

    constructor() ERC721("MSA NFT", "MSA") Ownable(msg.sender) {}

    function createProject(
        string memory _name,
        string memory _desc,
        Category _cat,
        uint256 _target,
        uint256 _deadline
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Empty name");
        require(_target > 0, "Invalid target");
        require(_deadline > block.timestamp, "Invalid deadline");

        projectCount++;
        uint256 id = projectCount;

        projects[id] = Project({
            org: msg.sender,
            name: _name,
            desc: _desc,
            cat: _cat,
            target: _target,
            raised: 0,
            deadline: _deadline,
            active: true,
            donors: 0
        });

        userProjects[msg.sender].push(id);
        emit ProjectCreated(id, msg.sender, _name);
        return id;
    }

    function donate(uint256 id) external payable nonReentrant {
        require(msg.value > 0, "No ETH");
        require(id > 0 && id <= projectCount, "Invalid project");
        require(projects[id].active, "Not active");
        require(block.timestamp <= projects[id].deadline, "Expired");

        Project storage proj = projects[id];

        // Check first donation
        bool first = true;
        Donation[] storage donList = donations[id];
        for (uint256 i = 0; i < donList.length; i++) {
            if (donList[i].donor == msg.sender) {
                first = false;
                break;
            }
        }

        if (first) proj.donors++;

        // Mint NFT
        uint256 nftId = _tokenIdCounter++;
        _safeMint(msg.sender, nftId);

        // Save donation
        donations[id].push(
            Donation({
                donor: msg.sender,
                amount: msg.value,
                time: block.timestamp,
                nftId: nftId
            })
        );

        // Update
        proj.raised += msg.value;
        userTotal[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit DonationMade(id, msg.sender, msg.value, nftId);
    }

    function withdraw(
        uint256 id,
        uint256 amount
    ) external onlyProjectOwner(id) nonReentrant {
        require(amount > 0 && amount <= projects[id].raised, "Invalid amount");

        projects[id].raised -= amount;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");

        emit Withdrawn(id, msg.sender, amount);
    }

    function getProject(
        uint256 id
    )
        external
        view
        returns (
            address org,
            string memory name,
            string memory desc,
            Category cat,
            uint256 target,
            uint256 raised,
            uint256 deadline,
            bool active,
            uint256 donors
        )
    {
        require(id > 0 && id <= projectCount, "Invalid project");
        Project storage p = projects[id];
        return (
            p.org,
            p.name,
            p.desc,
            p.cat,
            p.target,
            p.raised,
            p.deadline,
            p.active && block.timestamp <= p.deadline,
            p.donors
        );
    }

    function getUserProjects(
        address user
    ) external view returns (uint256[] memory) {
        return userProjects[user];
    }

    function getDonationCount(uint256 id) external view returns (uint256) {
        require(id > 0 && id <= projectCount, "Invalid project");
        return donations[id].length;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseTokenURI, _toString(tokenId)));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function setBaseURI(string memory uri) external onlyOwner {
        _baseTokenURI = uri;
    }
}
