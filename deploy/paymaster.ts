import { ethers, parseEther, formatEther } from "ethers"; // Import parseEther and formatEther directly
import * as fs from "fs";
import { Provider, Wallet } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const PRIVATE_KEY = "45a71309065d92d987010d97253ab26b0406f338b8de46a9c4f267d305c5d1fa";
const NFT_COLLECTION_ADDRESS = "0xa9e60dF81A06a042DE293A68Ead98D2F481F4Ed6";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

if (!NFT_COLLECTION_ADDRESS)
  throw "⛔️ NFT_COLLECTION_ADDRESS not detected! Add it to the NFT_COLLECTION_ADDRESS variable!";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the ERC721GatedPaymaster contract...`);
  const provider = new Provider("https://sepolia.era.zksync.dev");

  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  const paymasterArtifact = await deployer.loadArtifact("contracts/paymaster.sol:Paymaster");
  const deploymentFee = await deployer.estimateDeployFee(paymasterArtifact, [
    NFT_COLLECTION_ADDRESS,
  ]);
  
  // formatEther is now directly imported from ethers
  const parsedFee = formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  // Deploying the Paymaster contract
  const paymaster = await deployer.deploy(paymasterArtifact, [
    NFT_COLLECTION_ADDRESS,
  ]);
  
  // Await the Promise returned by getAddress()
  const paymasterAddress = await paymaster.getAddress();
  console.log(`Paymaster address: ${paymasterAddress}`);

  console.log("Funding paymaster with ETH");

  // Use parseEther directly (no utils anymore in ethers@6.x)
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymasterAddress,
      value: parseEther("0.005"),  // Using parseEther directly
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(paymasterAddress);
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);

  const contractFullyQualifedName = "contracts/paymaster.sol:Paymaster";
  
  // Contract verification
  const verificationId = await hre.run("verify:verify", {
    address: paymasterAddress,
    contract: contractFullyQualifedName,
    constructorArguments: [NFT_COLLECTION_ADDRESS],
    bytecode: paymasterArtifact.bytecode,
  });
  console.log(`${contractFullyQualifedName} verified! VerificationId: ${verificationId}`);

  console.log(`Done!`);
}
