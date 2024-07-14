import hre from "hardhat";

async function main() {
  const FreeMintNft = await hre.ethers.getContractFactory("FreeMintToken");
  const freeMintNft = await FreeMintNft.deploy();
  // @ts-expect-error
  console.log("FreeMintNft Contract deployed to:", freeMintNft.address);

  const OSSFunding = await hre.ethers.getContractFactory("OSSFunding");
  // @ts-expect-error
  const ossFunding = await OSSFunding.deploy(freeMintNft.address);
  // @ts-expect-error
  console.log("OSSFunding Contract deployed to:", ossFunding.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
