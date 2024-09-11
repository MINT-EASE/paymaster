// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MyNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    address public paymaster;
    uint256 public tokenId;
    string public baseURI;

     string[] public nfts = [
        "House",
        "Superman",
        "Beach",
        "Mountain",
        "Flowers",
        "Soul Stone"
     ];

    mapping(address => bool) public allowedMinters;
    mapping (address => uint256[]) private _ownedTokens;
    mapping (string => bool) public nftExists;

    constructor() ERC721("Crown", "Crown") Ownable() {
    }

    modifier onlyAllowedMinter() {
        require(allowedMinters[msg.sender], "Not allowed to mint");
        _;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
     }

    function setMinter(address minter, bool allowed) external onlyOwner {
        allowedMinters[minter] = allowed;
    }

    function mint(address recipient, string memory nftName) public onlyOwner {
        require(bytes(nftName).length > 0, "nftName must not be empty");
        require(recipient != address(0), "recipient must not be the zero address");
        require(!nftExists[nftName], "This stone already exists");
        
        for(uint i=0; i<nfts.length; i++) {
            if(keccak256(bytes(nftName)) == keccak256(bytes(nfts[i]))) {
                nftExists[nftName] = true;
                _safeMint(recipient, tokenId);
                _ownedTokens[recipient].push(tokenId);
                _setTokenURI(tokenId, nftName);
                tokenId++;
                break;
            }
        }
    }


    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }
 

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "/", Strings.toString(_tokenId))) : "";
        
        // return super.tokenURI(_tokenId);
    }

     function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    // function supportsInterface(
    //     bytes4 interfaceId
    // ) public view override(ERC721, ERC721URIStorage) returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }
}
