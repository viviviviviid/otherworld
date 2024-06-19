// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Proxy is Initializable, UUPSUpgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable {

    event MintERC721(uint256 tokenId, address creator, uint256 paymentAmount);
    event PaymentPriceUpdated(uint256 newPrice);
    event UpdateLogicContract(address logicContract);
    
    uint256 public paymentPrice; 
    // delegateCall의 스토리지 충돌문제를 해결하기위해, 여기와 Logic.sol의 변수 선언순서가 같아야함. 그래야 스토리지 슬롯 번호에 똑같이 값이 들어가게 됨.
    uint256 public nextTokenId;
    ERC20Upgradeable public paymentToken;
    address public paymentTokenAddress;
    address public paymentLogic;

    function initialize(address _paymentToken, uint256 _paymentPrice, address _paymentLogic) public initializer {
        __ERC721_init("ITEM", "NFT");
        __ERC721URIStorage_init();
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);
        paymentToken = ERC20Upgradeable(_paymentToken);
        paymentTokenAddress = _paymentToken;
        paymentPrice = _paymentPrice;
        nextTokenId = 0;
        paymentLogic = _paymentLogic;
        transferOwnership(msg.sender); 
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        require(paymentToken.transferFrom(msg.sender, address(this), paymentPrice), "Payment failed");
        _mint(recipient, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        emit MintERC721(nextTokenId, msg.sender, paymentPrice);
        nextTokenId++;
        return nextTokenId;
    }

    function updatePaymentPrice() public onlyOwner {
        (bool success, ) = paymentLogic.delegatecall(
            abi.encodeWithSignature("calculatePrice()")
        );
        require(success, "Logic call failed");
        emit PaymentPriceUpdated(paymentPrice);
    }

    function getPaymentPrice() public view returns (uint256) {
        return paymentPrice;
    }

    function getTokenContract() public view returns (address) {
        return paymentTokenAddress;
    }

    function getLogicContract() public view returns (address) {
        return paymentLogic;
    }

    function updateLogicContract(address _paymentLogic) public onlyOwner {
        require(paymentLogic != _paymentLogic, "It's the same contract address as before.");
        paymentLogic = _paymentLogic;
        emit UpdateLogicContract(paymentLogic);
    }

    function testDelegateCall() public onlyOwner returns (bool) {
        (bool success, ) = paymentLogic.delegatecall(
            abi.encodeWithSignature("calculatePrice()")
        );
        return success;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function getNextTokenID() public view returns (uint256) {
        return nextTokenId;
    }

    // override 
    function _msgSender() internal view override(ContextUpgradeable) returns (address) {
        return super._msgSender();
    }
    // override
    function _msgData() internal view override(ContextUpgradeable) returns (bytes calldata) {
        return super._msgData();
    }
}

