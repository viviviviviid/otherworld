// // SPDX-License-Identifier: MIT
// // Compatible with OpenZeppelin Contracts ^5.0.0
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// import "hardhat/console.sol";

// // contract Token is ERC20 {
  
//   function mintERC20(address to, uint256 amount) public onlyOwner {
//     _mint(to, amount);
//     emit MintERC20();
//   }
  
// // }


// // contract Token is Ownable {

// //   struct NFT {
// //     uint256 tier;
// //     string  title;
// //     address creator;
// //   }

// //   uint256 public nextTokenId;
  
// //   mapping(uint256 => NFT) public nfts;

// //   event MintERC20();
// //   event MintERC721();



// //   function mintERC721(uint256 tier, string memory title)  public {

// //     emit MintERC721();
// //   }

// //   function updateMintFee() public onlyOwner {
// //     // modifier을 바꾸든 뭘 하든간에, 컨트랙트 발행자만 가능하도록
// //     // 업그레이더블 컨트랙트 함수 
// //   } 

// // }

// // contract PayManager {

// //   function calculateMintFee() public {
// //     // 업그레이더블 컨트랙트 함수의 변할 수 있는 알고리즘 부분
// //     // 현재는 
// //   }


// // }