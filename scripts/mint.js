const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("TechShark");
  const { CONTRACT_ADDRESS } = process.env;
  const contract = NFT.attach(CONTRACT_ADDRESS);
  const price = "0.001"  // MINT PRICE
  await contract.mint({value: ethers.utils.parseUnits(price, 'ether')});
  // console.log(await contract.tokenURI(2));
}
main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});