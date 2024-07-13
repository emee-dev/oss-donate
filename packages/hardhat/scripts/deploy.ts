import hre from "hardhat";

async function main() {
  const FreeMintNft = await hre.ethers.getContractFactory("FreeMintToken");
  const freeMintNft = await FreeMintNft.deploy();
  console.log("FreeMintNft Contract deployed to:", freeMintNft.address);

  const OSSFunding = await hre.ethers.getContractFactory("OSSFunding");
  const ossFunding = await OSSFunding.deploy(freeMintNft.address);
  console.log("OSSFunding Contract deployed to:", ossFunding.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
