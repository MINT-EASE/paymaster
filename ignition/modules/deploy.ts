
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";




  // Compile and deploy contract
  const myNftModule = buildModule("MyNFTModule", (m) => {
  const PAYMASTER = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46"; 

    const myNft = m.contract("MyNFT", [PAYMASTER]);

    return { myNft };  
    });

export default myNftModule;


