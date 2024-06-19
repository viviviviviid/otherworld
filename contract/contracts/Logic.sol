// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentLogic {
    uint256 public paymentPrice; // 여기와 Proxy.sol의 변수 선언순서가 같아야함. 그래야 스토리지 슬롯 번호에 똑같이 값이 들어가게 됨.
    uint256 private constant a = 1664525;
    uint256 private constant c = 1013904223;
    uint256 seed = block.timestamp;

    function calculatePrice() public {
        seed = (a * seed + c) % 100;
        paymentPrice = uint256(seed);
    }

    function getPaymentPrice() public view returns (uint256) {
        return paymentPrice;
    }
}