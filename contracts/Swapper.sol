// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//   ______                                     
//  / _____)                                    
// ( (____  _ _ _ _____ ____  ____  _____  ____ 
//  \____ \| | | (____ |  _ \|  _ \| ___ |/ ___)
//  _____) ) | | / ___ | |_| | |_| | ____| |    
// (______/ \___/\_____|  __/|  __/|_____)_|    
//                     |_|   |_|                

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FermatToken.sol";

contract Swapper is Ownable {
    uint pricePerToken;

    FermatToken public tokenFRM;

    mapping(address => uint) liquidity;

    constructor(address tokenFRM_) {
        pricePerToken = 1 * 10 ** 18;
        tokenFRM = FermatToken(tokenFRM_);
    }

    /**
    * Mints an initial supply of the FRM token
    * 
    */
    function mintFRM() external onlyOwner {
        tokenFRM.mint(address(this), 1000000 * 10 ** 18);
    }

    /**
    * Add initial liquidity to the swapper
    *
    * @param token_ address of token to provide liquidity for
    * @param amount amount of token to deposit
    */
    function init(address token_, uint amount) external {
        require(IERC20(token_).balanceOf(address(this)) == 0, "Liquidity already exists");
        require(IERC20(token_).transferFrom(msg.sender, address(this), amount));

        liquidity[token_] = amount;   
    }

    /**
    * Convert an amount of input token_ to an equivalent amount of the output token
    *
    * @param token_ address of token to swap
    * @param amount amount of token to swap/receive
    */
    function swap(address token_, uint amount) external {
        require(IERC20(token_).transferFrom(msg.sender, address(this), amount));
        liquidity[token_] = IERC20(token_).balanceOf(address(this));

        uint outputAmount = amount / pricePerToken;

        require(tokenFRM.transfer(msg.sender, outputAmount * 10 ** 18));
    }

    /**
    * Convert an amount of the output token to an equivalent amount of input token
    * 
    * @param token_ address of token to recieve
    * @param amount amount of token to swap/recieve
    */
    function unswap(address token_, uint amount) external returns (uint, uint, uint) {
        uint outputAmount = amount / pricePerToken;

        // 1. transfer FRM tokens to swapper
        require(tokenFRM.transferFrom(msg.sender, address(this), outputAmount * 10 ** 18));
        // 2. transfer requested amount of ELR/GAU back to msg.sender
        require(IERC20(token_).transfer(msg.sender, amount));
        // require(IERC20(token_).transferFrom(msg.sender, address(this), amount));

        liquidity[token_] = IERC20(token_).balanceOf(address(this));

        return (amount, outputAmount, pricePerToken);
    }
    
    /**
    * Set a new price for the FRM toke
    *
    * @param newPrice the new price for token
    */
    function setPriceFRM(uint newPrice) external onlyOwner {
        pricePerToken = newPrice * 10 ** 18;
    }

    function getPriceFRM() view external returns (uint) {
       return pricePerToken;
    }
}