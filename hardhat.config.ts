import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@matterlabs/hardhat-zksync";
import "@matterlabs/hardhat-zksync-verify";



const config: HardhatUserConfig = {
  solidity: "0.8.24",

  networks: {
    // sepolia: {
    //   url: "https://zksync-sepolia.g.alchemy.com/v2/qEmpdbwR0-Q8zlYviUFkX1d_B8b3RJq0",
    // },
     hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "https://zksync-sepolia.g.alchemy.com/v2/qEmpdbwR0-Q8zlYviUFkX1d_B8b3RJq0",
      // ADDITION
     // deployPaths: "deploy-zksync", //single deployment directory
      zksync: true,
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification'
    },
  },

    etherscan: {
   
    apiKey: {
      "sepolia": "123",
    },
   
  },
 
  // defaultNetwork: "zkSyncTestnet",
};

export default config;


 //  networks: {
  //   hardhat: {
  //     zksync: false,
  //   },
  //   zkSyncTestnet: {
  //     url: "https://sepolia.era.zksync.dev",
  //     ethNetwork: "sepolia", // orsepolia a Sepolia RPC endpoint from Infura/Alchemy/Chainstack etc. https://zksync-sepolia.g.alchemy.com/v2/qEmpdbwR0-Q8zlYviUFkX1d_B8b3RJq0
  //     zksync: true,
  //   },
    
  // },