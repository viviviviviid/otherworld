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
    
    uint256 public paymentPrice; // 여기와 Logic.sol의 변수 선언순서가 같아야함. 그래야 스토리지 슬롯 번호에 똑같이 값이 들어가게 됨.
    uint256 public nextTokenId;
    address public paymentLogic;
    ERC20Upgradeable public paymentToken;

    function initialize(address _paymentToken, uint256 _paymentPrice, address _paymentLogic) public initializer {
        __ERC721_init("ITEM", "NFT");
        __ERC721URIStorage_init();
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);
        paymentToken = ERC20Upgradeable(_paymentToken);
        paymentPrice = _paymentPrice    ;
        nextTokenId = 0;
        paymentLogic = _paymentLogic;
        transferOwnership(msg.sender); // init owner
        // init이 잘 됐는지 여러가지 테스트
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        require(paymentToken.transferFrom(msg.sender, address(this), paymentPrice), "Payment failed");
        _mint(recipient, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        emit MintERC721(nextTokenId, msg.sender, paymentPrice);
        nextTokenId++;
        return nextTokenId;
        // 지갑의 밸런스 값 - 토큰지붋지용인지 테스트
        // URI가 들어가 있는지 테스트
        // 토큰 아이디가 1만큼 증가했는지 테스트
        // tokenId에 해당되는 오너의 지갑주소가 msg.sender인지 테스트
    }

    function updatePaymentPrice() public onlyOwner {
        (bool success, ) = paymentLogic.delegatecall(
            abi.encodeWithSignature("calculatePrice()")
        );
        require(success, "Logic call failed");
        emit PaymentPriceUpdated(paymentPrice);
        // Logic 컨트랙트의 calculatePrice를 직접 실행했을때 값과, 
        // 이 updatePaymentPrice를 실행해서 Logic의 함수가 실행되고, 
        // price가 바뀐 현재 값이 동일한 값으로 출력되는가. 
        // 즉 delegateCall이 성공적으로 호출되서 잘 적용됐는가
    }

    function getPaymentPrice() public view returns (uint256) {
        return paymentPrice;
    }

    function getLogicContract() public view returns (address) {
        return paymentLogic;
    }

    function updateLogicContract(address _paymentLogic) public onlyOwner {
        require(paymentLogic != _paymentLogic, "It's the same contract address as before.");
        paymentLogic = _paymentLogic;
        emit UpdateLogicContract(paymentLogic);
        // 새로 넣은 컨트랙트의 주소값이 제대로 들어가있는지 // 즉, js에서 이 함수에 넣은 파라미터와, getLogicContract에서 return된 주소값이 동일한지
    }

    function testDelegateCall() public onlyOwner returns (bool) {
        (bool success, ) = paymentLogic.delegatecall(
            abi.encodeWithSignature("calculatePrice()")
        );
        return success;
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

