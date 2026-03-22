import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Raydium, TxVersion } from "@raydium-io/raydium-sdk-v2";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as fs from "fs";
import BN from "bn.js";

const MINT_ADDRESS = "4LeFXFY33qQFz6KoPw54higA8JPKeqc5AemdUzHH1oSS";

async function main() {
  const walletPath = process.env.HOME + "/system-dropshoping/dropaccess-wallet.json";
  const secretKey = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
  const owner = Keypair.fromSecretKey(Uint8Array.from(secretKey));

  console.log("Wallet:", owner.publicKey.toBase58());

  const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
  const balance = await connection.getBalance(owner.publicKey);
  console.log("Balance:", balance / 1e9, "SOL");

  console.log("Loading Raydium SDK...");
  const raydium = await Raydium.load({
    owner,
    connection,
    cluster: "mainnet",
    disableFeatureCheck: true,
    blockhashCommitment: "finalized",
  });

  console.log("Fetching pool configs...");
  const cpmmConfigs = await raydium.api.getCpmmConfigs();
  console.log("Available configs:", cpmmConfigs.length);

  // Find a config that has an initialized fee account
  for (const cfg of cpmmConfigs) {
    console.log(`Config: ${cfg.id}, fundOwner: ${(cfg as any).fundOwner || 'N/A'}, createPoolFee: ${(cfg as any).createPoolFee || 'N/A'}`);
  }

  // Derive the correct pool fee account - it's the ATA of WSOL for the fund owner
  const feeConfig = cpmmConfigs[0];
  const fundOwner = new PublicKey((feeConfig as any).fundOwner || "GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL");
  const WSOL = new PublicKey("So11111111111111111111111111111111111111112");
  // Correct fee account from on-chain error log
  const poolFeeAccount = new PublicKey("DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8");

  console.log("Fund owner:", fundOwner.toBase58());
  console.log("Pool fee account:", poolFeeAccount.toBase58());

  // Check if this account exists
  const feeAccountInfo = await connection.getAccountInfo(poolFeeAccount);
  console.log("Fee account exists:", !!feeAccountInfo);

  const mintA = new PublicKey("So11111111111111111111111111111111111111112");
  const mintB = new PublicKey(MINT_ADDRESS);

  console.log("Creating CPMM pool: SOL/DROPA");

  const { execute, extInfo } = await raydium.cpmm.createPool({
    programId: new PublicKey("CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"),
    poolFeeAccount,
    ownerInfo: {
      feePayer: owner.publicKey,
      useSOLBalance: true,
    },
    mintA: {
      address: mintA,
      programId: TOKEN_PROGRAM_ID,
      decimals: 9,
    },
    mintB: {
      address: mintB,
      programId: TOKEN_PROGRAM_ID,
      decimals: 9,
    },
    mintAAmount: new BN("300000000"), // 0.3 SOL
    mintBAmount: new BN("400000000000000000"), // 400M DROPA
    startTime: new BN(0),
    feeConfig,
    associatedOnly: false,
    txVersion: TxVersion.LEGACY,
  } as any);

  console.log("Pool ID:", extInfo.address.poolId.toBase58());
  console.log("Sending transaction...");

  const txIds = await execute({ sendAndConfirm: true });
  console.log("=== LIQUIDITY POOL CREATED ===");
  console.log("Pool ID:", extInfo.address.poolId.toBase58());
  console.log("TX:", JSON.stringify(txIds));
  console.log(`Raydium: https://raydium.io/swap/?inputMint=sol&outputMint=${MINT_ADDRESS}`);
  console.log(`DEXScreener: https://dexscreener.com/solana/${MINT_ADDRESS}`);
}

main().catch(console.error);
