// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentLogic {
    uint256 public paymentPrice; // 여기와 Proxy.sol의 변수 선언순서가 같아야함. 그래야 스토리지 슬롯 번호에 똑같이 값이 들어가게 됨.

    function calculateAndSetPaymentPrice() public {
        // 추후 새로운 값을 책정하는 새로운 로직으로 변경할때, 이 부분을 수정하고 배포한 뒤, Proxy.sol의 updateLogicContract 함수에다가 컨트랙트 주소를 넣고 업데이트하면 됨.
        paymentPrice = 1000;
    }
}