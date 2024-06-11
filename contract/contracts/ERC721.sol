// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyNFT is ERC721URIStorage {

    event MintERC721(uint256 tokenId, address creator, uint256 payAmount);

    IERC20 public paymentToken;
    uint256 public mintPrice;
    uint256 public nextTokenId;
    address public owner;

    constructor(address _paymentToken, uint256 _mintPrice) ERC721("ITEM", "NFT") {
        paymentToken = IERC20(_paymentToken);
        mintPrice = _mintPrice;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        require(paymentToken.transferFrom(msg.sender, address(this), mintPrice), "Payment failed");
        // 20토큰의 balanceOf가 10을 뺸 수량과 같을때 => 테스트케이스
        _mint(recipient, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        nextTokenId++;

        return nextTokenId;
    }

    // function updateMintPrice() public onlyOwner {
        // 업그레이더블 컨트랙트 함수 
        // mintPrice = 
    // } 
}
