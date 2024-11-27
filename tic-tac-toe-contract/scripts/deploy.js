const hre = require("hardhat");

async function main() {
  const gameFee = ethers.utils.parseEther("0.01"); // Oyuna katılım ücreti (0.01 ETH)
  const contractFactory = await hre.ethers.getContractFactory("TicTacToeGame");
  const contract = await contractFactory.deploy(gameFee);

  await contract.deployed();

  console.log(`TicTacToeGame deployed to: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
