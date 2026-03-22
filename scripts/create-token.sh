#!/bin/bash
# DropAccess (DROPA) Token Creation Script
# Run this on Solana devnet (free) or mainnet (~0.05 SOL)
# Usage: bash scripts/create-token.sh

set -e

export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

WALLET="$HOME/system-dropshoping/dropaccess-wallet.json"
DECIMALS=9
SUPPLY=1000000000

echo "=== DropAccess Token Creator ==="
echo ""

# Check which network
NETWORK=$(solana config get | grep "RPC URL" | awk '{print $NF}')
echo "Network: $NETWORK"
echo "Wallet: $(solana address -k $WALLET)"
echo "Balance: $(solana balance -k $WALLET)"
echo ""

# Step 1: Get devnet SOL if needed
if [[ "$NETWORK" == *"devnet"* ]]; then
  echo "Step 0: Requesting devnet airdrop..."
  solana airdrop 2 -k $WALLET || echo "Airdrop failed - you may need to visit https://faucet.solana.com"
  echo ""
fi

# Step 1: Create the token
echo "Step 1: Creating token..."
MINT=$(spl-token create-token --decimals $DECIMALS -p TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA --owner $WALLET 2>&1 | grep "Creating token" | awk '{print $3}')
echo "Mint address: $MINT"
echo ""

# Step 2: Create token account
echo "Step 2: Creating token account..."
spl-token create-account $MINT --owner $WALLET
echo ""

# Step 3: Mint total supply
echo "Step 3: Minting $SUPPLY tokens..."
spl-token mint $MINT $SUPPLY --mint-authority $WALLET
echo ""

# Step 4: Verify supply
echo "Step 4: Verifying supply..."
spl-token supply $MINT
echo ""

# Step 5: Disable minting
echo "Step 5: Disabling future minting (irreversible)..."
spl-token authorize $MINT mint --disable --owner $WALLET
echo ""

echo "=== TOKEN CREATED SUCCESSFULLY ==="
echo ""
echo "Mint Address: $MINT"
echo "Total Supply: $SUPPLY"
echo "Decimals: $DECIMALS"
echo "Minting: DISABLED"
echo ""
echo "Next steps:"
echo "1. Update src/lib/constants.ts with mint address: $MINT"
echo "2. View on SolScan: https://solscan.io/token/$MINT"
echo "3. Add metadata using: metaboss create metadata -a $MINT -m <METADATA_URI>"
echo ""
