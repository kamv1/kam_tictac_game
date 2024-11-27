// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicTacToeGame {
    address public owner; // Sözleşme sahibinin adresi
    uint256 public gameFee; // Oyuna katılım ücreti
    address public donationAddress = 0x1BCB2c144fB938ff7f670d095274905676Ff8af0;

    event GamePlayed(address indexed player, uint256 amount);
    event DonationReceived(address indexed donator, uint256 amount);

    constructor(uint256 _gameFee) {
        owner = msg.sender; // Sözleşmeyi oluşturan kişi sahibi olur
        gameFee = _gameFee; // Oyuna katılım ücreti
    }

    // Oyuna katılmak için ödeme yapılır
    function playGame() external payable {
        require(msg.value == gameFee, "Incorrect game fee");
        emit GamePlayed(msg.sender, msg.value);
    }

    // Bağış yapmak için, herhangi bir miktar kabul edilir
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        payable(donationAddress).transfer(msg.value); // Bağışı doğrudan belirlenen adrese aktar
        emit DonationReceived(msg.sender, msg.value);
    }

    // Sözleşme sahibinin fonları çekmesine izin ver
    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Oyun ücretini değiştirme
    function setGameFee(uint256 _gameFee) external {
        require(msg.sender == owner, "Only owner can set fee");
        gameFee = _gameFee;
    }
}
