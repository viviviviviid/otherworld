// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PaymentToken is ERC20 {
    uint256 public initialSupply = 100000000;

    constructor() ERC20("PaymentToken", "PT") {
        _mint(msg.sender, initialSupply);
    }
}
