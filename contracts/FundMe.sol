// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.8;

// Imports
import './PriceConverter.sol';

// Error Codes
error FundMe__NotOwner();
error FundMe__DidNotSendMinimumUSD();
error FundMe__WithdrawError();

// Interfaces, Libraries, Contracts
/**
 * @title A contract for crowd funding
 * @author Luis Gerardo
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
  // Type declarations
  using PriceConverter for uint256;

  // State Variables
  mapping(address => uint256) private s_addressToAmountFunded;
  address[] private s_funders;
  address private immutable i_owner;
  uint256 public constant MINIMUM_USD = 50 * 1e18;
  AggregatorV3Interface private s_priceFeed;

  // Events, Modifiers
  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__NotOwner();
    }
    _;
  }

  //constructor, receive, fallback Functions
  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  receive() external payable {
    if (msg.value > 100) {
      fund();
    }
  }

  fallback() external payable {
    if (msg.value > 100) {
      fund();
    }
  }

  //Other Functions
  /**
   * @notice This function funds this contract
   * @dev This implements price feeds as our library
   */
  function fund() public payable {
    if (msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) {
      revert FundMe__DidNotSendMinimumUSD();
    }

    s_funders.push(msg.sender);
    s_addressToAmountFunded[msg.sender] += msg.value;
  }

  function withdraw() public payable onlyOwner {
    address[] memory funders = s_funders;

    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }

    s_funders = new address[](0);

    (bool success, ) = i_owner.call{value: address(this).balance}('');
    if (!success) {
      revert FundMe__WithdrawError();
    }
  }

  //View, Pure Functions
  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getFunders(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getAddressToAmountFunded(address funder)
    public
    view
    returns (uint256)
  {
    return s_addressToAmountFunded[funder];
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }
}
