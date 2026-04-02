# n8n-nodes-euler-protocol

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for interacting with Euler Protocol, a permissionless lending protocol on Ethereum. This node provides access to 5 core resources including vault management, lending operations, borrowing functionality, liquidation monitoring, and comprehensive analytics for DeFi automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Ethereum](https://img.shields.io/badge/Ethereum-DeFi-purple)
![Lending Protocol](https://img.shields.io/badge/Lending-Protocol-green)
![Web3](https://img.shields.io/badge/Web3-Compatible-orange)

## Features

- **Vault Management** - Create, monitor, and manage Euler Protocol vaults with real-time position tracking
- **Lending Operations** - Supply assets to earn yield with automated interest rate monitoring and withdrawal management
- **Borrowing Functionality** - Access liquidity through collateralized borrowing with health factor monitoring
- **Liquidation Monitoring** - Track at-risk positions and execute liquidations with profit optimization
- **Real-time Analytics** - Access comprehensive protocol metrics, TVL data, and market insights
- **Risk Management** - Monitor collateral ratios, health factors, and liquidation thresholds
- **Multi-Asset Support** - Work with various ERC-20 tokens supported by Euler Protocol
- **Gas Optimization** - Smart transaction batching and gas price optimization for cost-effective operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-euler-protocol`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-euler-protocol
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-euler-protocol.git
cd n8n-nodes-euler-protocol
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-euler-protocol
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Euler Protocol API key for authenticated requests | Yes |
| Environment | Protocol environment (mainnet/testnet) | Yes |
| Wallet Address | Ethereum wallet address for operations | Yes |
| Private Key | Private key for transaction signing (encrypted) | Yes |

## Resources & Operations

### 1. Vault

| Operation | Description |
|-----------|-------------|
| Create | Create a new Euler Protocol vault |
| Get Details | Retrieve vault information and current status |
| List Vaults | Get all vaults for a specific address |
| Update Configuration | Modify vault settings and parameters |
| Close Vault | Close and settle vault positions |

### 2. Lending

| Operation | Description |
|-----------|-------------|
| Supply Assets | Deposit assets to earn lending yield |
| Withdraw Assets | Remove supplied assets from the protocol |
| Get Supply Balance | Check current supplied asset balances |
| Get Interest Earned | Retrieve accumulated interest earnings |
| Set Interest Rate Mode | Configure variable or stable interest rates |

### 3. Borrowing

| Operation | Description |
|-----------|-------------|
| Borrow Assets | Borrow assets against collateral |
| Repay Loan | Repay borrowed amounts with interest |
| Get Borrow Balance | Check current borrowed asset amounts |
| Get Health Factor | Retrieve account health and liquidation risk |
| Set Collateral | Enable/disable assets as collateral |

### 4. Liquidation

| Operation | Description |
|-----------|-------------|
| Check Liquidation | Monitor positions for liquidation opportunities |
| Execute Liquidation | Perform liquidation of undercollateralized positions |
| Get Liquidation Threshold | Retrieve liquidation parameters for assets |
| Calculate Profit | Estimate liquidation profitability |
| Monitor Positions | Track multiple positions for liquidation risks |

### 5. Analytics

| Operation | Description |
|-----------|-------------|
| Get Protocol Stats | Retrieve overall protocol metrics and TVL |
| Get Market Data | Access asset prices and market information |
| Get Historical Data | Fetch historical protocol and market data |
| Generate Reports | Create comprehensive analytics reports |
| Track Performance | Monitor portfolio and position performance |

## Usage Examples

```javascript
// Supply USDC to earn lending yield
{
  "asset": "USDC",
  "amount": "1000",
  "walletAddress": "0x742d35Cc6075C4532B8d0b7d1B63d5b18B6c3f7",
  "enableAsCollateral": true
}
```

```javascript
// Borrow ETH against supplied collateral
{
  "asset": "WETH",
  "amount": "0.5",
  "interestRateMode": "variable",
  "walletAddress": "0x742d35Cc6075C4532B8d0b7d1B63d5b18B6c3f7"
}
```

```javascript
// Monitor liquidation opportunities
{
  "minHealthFactor": "1.05",
  "minProfitThreshold": "50",
  "assets": ["USDC", "WETH", "DAI"],
  "maxGasPrice": "30"
}
```

```javascript
// Get protocol analytics and TVL data
{
  "timeframe": "24h",
  "includeHistorical": true,
  "assets": ["all"],
  "metrics": ["tvl", "borrowVolume", "liquidations"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Insufficient Collateral | Borrowing amount exceeds available collateral | Reduce borrow amount or add more collateral |
| Invalid Asset | Asset not supported by Euler Protocol | Use supported assets from protocol documentation |
| Gas Estimation Failed | Transaction gas estimation error | Check network conditions and retry |
| Health Factor Too Low | Position at risk of liquidation | Add collateral or repay debt |
| API Rate Limit | Too many requests to Euler API | Implement request throttling and retry logic |
| Network Connection | Ethereum network connectivity issues | Verify network status and RPC endpoint |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-euler-protocol/issues)
- **Euler Protocol Documentation**: [docs.euler.finance](https://docs.euler.finance)
- **DeFi Community**: [DeFi Pulse Community](https://defipulse.com)