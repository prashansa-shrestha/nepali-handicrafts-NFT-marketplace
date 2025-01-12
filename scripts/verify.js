
// verification/verify.js
const hre = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

async function main() {
  console.log("Beginning contract verification...");

  // Load deployment info
  const fs = require('fs');
  const deploymentPath = `deployments/${network.name}.json`;
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath));

  // Helper function to verify contract
  async function verifyContract(name, address, constructorArguments = []) {
    console.log(`\nVerifying ${name}...`);
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: constructorArguments,
      });
      console.log(`${name} verified successfully`);
    } catch (error) {
      console.log(`Error verifying ${name}:`, error.message);
    }
  }

  // Verify implementations
  console.log("\nVerifying implementation contracts...");

  // 1. Verify ArtisanRegistry implementation
  await verifyContract(
    "ArtisanRegistry Implementation",
    deploymentInfo.ArtisanRegistry.implementation
  );

  // 2. Verify ListingManager implementation
  await verifyContract(
    "ListingManager Implementation",
    deploymentInfo.ListingManager.implementation,
    [deploymentInfo.ArtisanRegistry.proxy] // Constructor args
  );

  // 3. Verify TokenManager implementation
  await verifyContract(
    "TokenManager Implementation",
    deploymentInfo.TokenManager.implementation
  );

  // 4. Verify TransactionProcessor implementation
  await verifyContract(
    "TransactionProcessor Implementation",
    deploymentInfo.TransactionProcessor.implementation,
    [
      deploymentInfo.ListingManager.proxy,
      deploymentInfo.TokenManager.proxy
    ]
  );

  // 5. Verify VerificationController implementation
  await verifyContract(
    "VerificationController Implementation",
    deploymentInfo.VerificationController.implementation
  );

  // 6. Verify FeeController implementation
  await verifyContract(
    "FeeController Implementation",
    deploymentInfo.FeeController.implementation
  );

  console.log("\nVerification process completed");
  
  // Save verification status
  const verificationInfo = {
    ...deploymentInfo,
    verificationInfo: {
      timestamp: new Date().toISOString(),
      network: network.name,
      status: "completed",
    },
  };

  fs.writeFileSync(deploymentPath, JSON.stringify(verificationInfo, null, 2));
  console.log(`\nVerification info saved to ${deploymentPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });