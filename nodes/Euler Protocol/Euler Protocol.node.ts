/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-eulerprotocol/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class EulerProtocol implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Euler Protocol',
    name: 'eulerprotocol',
    icon: 'file:eulerprotocol.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Euler Protocol API',
    defaults: {
      name: 'Euler Protocol',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'eulerprotocolApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Vault',
            value: 'vault',
          },
          {
            name: 'Lending',
            value: 'lending',
          },
          {
            name: 'Borrowing',
            value: 'borrowing',
          },
          {
            name: 'Liquidation',
            value: 'liquidation',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          }
        ],
        default: 'vault',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['vault'] } },
  options: [
    { name: 'Get All Vaults', value: 'getAllVaults', description: 'Get all available vaults', action: 'Get all vaults' },
    { name: 'Get Vault', value: 'getVault', description: 'Get specific vault details', action: 'Get a vault' },
    { name: 'Create Vault', value: 'createVault', description: 'Create new vault position', action: 'Create a vault' },
    { name: 'Update Vault', value: 'updateVault', description: 'Update vault configuration', action: 'Update a vault' },
    { name: 'Delete Vault', value: 'deleteVault', description: 'Close vault position', action: 'Delete a vault' }
  ],
  default: 'getAllVaults',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['lending'] } },
  options: [
    { name: 'Get Markets', value: 'getMarkets', description: 'Get all lending markets', action: 'Get all lending markets' },
    { name: 'Get Positions', value: 'getPositions', description: 'Get user lending positions', action: 'Get user lending positions' },
    { name: 'Deposit', value: 'deposit', description: 'Deposit assets to earn interest', action: 'Deposit assets to earn interest' },
    { name: 'Withdraw', value: 'withdraw', description: 'Withdraw deposited assets', action: 'Withdraw deposited assets' },
    { name: 'Get Rates', value: 'getRates', description: 'Get current lending rates', action: 'Get current lending rates' }
  ],
  default: 'getMarkets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['borrowing'] } },
  options: [
    { name: 'Get Borrow Positions', value: 'getBorrowPositions', description: 'Get user borrowing positions', action: 'Get borrow positions' },
    { name: 'Borrow', value: 'borrow', description: 'Borrow assets against collateral', action: 'Borrow assets' },
    { name: 'Repay', value: 'repay', description: 'Repay borrowed assets', action: 'Repay borrowed assets' },
    { name: 'Get Health Factor', value: 'getHealthFactor', description: 'Get position health factor', action: 'Get health factor' },
    { name: 'Get Borrow Limits', value: 'getBorrowLimits', description: 'Get maximum borrowing capacity', action: 'Get borrow limits' },
  ],
  default: 'getBorrowPositions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
    },
  },
  options: [
    {
      name: 'Get Liquidation Opportunities',
      value: 'getLiquidationOpportunities',
      description: 'Get available liquidation opportunities',
      action: 'Get liquidation opportunities',
    },
    {
      name: 'Execute Liquidation',
      value: 'executeLiquidation',
      description: 'Execute liquidation of position',
      action: 'Execute liquidation',
    },
    {
      name: 'Get Liquidation History',
      value: 'getLiquidationHistory',
      description: 'Get historical liquidation data',
      action: 'Get liquidation history',
    },
    {
      name: 'Get Position Health',
      value: 'getPositionHealth',
      description: 'Monitor position health for liquidation risk',
      action: 'Get position health',
    },
    {
      name: 'Get Liquidation Penalties',
      value: 'getLiquidationPenalties',
      description: 'Get liquidation penalty rates',
      action: 'Get liquidation penalties',
    },
  ],
  default: 'getLiquidationOpportunities',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['analytics'] } },
	options: [
		{ name: 'Get Total Value Locked', value: 'getTotalValueLocked', description: 'Get protocol TVL metrics', action: 'Get total value locked' },
		{ name: 'Get Volume', value: 'getVolume', description: 'Get trading and lending volume', action: 'Get volume' },
		{ name: 'Get Revenue', value: 'getRevenue', description: 'Get protocol revenue data', action: 'Get revenue' },
		{ name: 'Get User Metrics', value: 'getUserMetrics', description: 'Get user adoption metrics', action: 'Get user metrics' },
		{ name: 'Get APY Data', value: 'getAPYData', description: 'Get historical APY data for markets', action: 'Get APY data' }
	],
	default: 'getTotalValueLocked',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  options: [
    { name: 'Ethereum Mainnet', value: 'mainnet' },
    { name: 'Ethereum Goerli', value: 'goerli' },
    { name: 'Ethereum Sepolia', value: 'sepolia' }
  ],
  default: 'mainnet',
  displayOptions: { show: { resource: ['vault'], operation: ['getAllVaults'] } },
  description: 'Blockchain network to query'
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'All', value: 'all' }
  ],
  default: 'active',
  displayOptions: { show: { resource: ['vault'], operation: ['getAllVaults'] } },
  description: 'Filter vaults by status'
},
{
  displayName: 'Vault ID',
  name: 'vaultId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['vault'], operation: ['getVault', 'updateVault', 'deleteVault'] } },
  description: 'The ID of the vault'
},
{
  displayName: 'Collateral',
  name: 'collateral',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['vault'], operation: ['createVault'] } },
  description: 'Collateral asset address or symbol'
},
{
  displayName: 'Borrow Asset',
  name: 'borrowAsset',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['vault'], operation: ['createVault'] } },
  description: 'Asset to borrow address or symbol'
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['vault'], operation: ['createVault'] } },
  description: 'Amount to deposit as collateral'
},
{
  displayName: 'Collateral Ratio',
  name: 'collateralRatio',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['vault'], operation: ['updateVault'] } },
  description: 'New collateral ratio for the vault'
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  displayOptions: { show: { resource: ['lending'], operation: ['getMarkets'] } },
  options: [
    { name: 'Ethereum Mainnet', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' }
  ],
  default: 'ethereum',
  description: 'The blockchain network to query'
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  displayOptions: { show: { resource: ['lending'], operation: ['getMarkets', 'deposit', 'withdraw', 'getRates'] } },
  default: '',
  description: 'The asset symbol (e.g., ETH, USDC, DAI)',
  required: true
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  displayOptions: { show: { resource: ['lending'], operation: ['getPositions', 'deposit', 'withdraw'] } },
  default: '',
  description: 'The Ethereum address of the user',
  required: true
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  displayOptions: { show: { resource: ['lending'], operation: ['deposit', 'withdraw'] } },
  default: '',
  description: 'The amount to deposit or withdraw (in the asset\'s smallest unit)',
  required: true
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  displayOptions: { show: { resource: ['lending'], operation: ['getRates'] } },
  default: '',
  description: 'The specific market identifier for rates'
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['getBorrowPositions'] } },
  default: '',
  placeholder: '0x...',
  description: 'The user wallet address to get borrowing positions for',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['borrow'] } },
  default: '',
  placeholder: 'USDC',
  description: 'The asset to borrow',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['borrow'] } },
  default: '',
  placeholder: '1000.50',
  description: 'The amount to borrow',
},
{
  displayName: 'Collateral',
  name: 'collateral',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['borrow'] } },
  default: '',
  placeholder: 'ETH',
  description: 'The collateral asset',
},
{
  displayName: 'Asset',
  name: 'repayAsset',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['repay'] } },
  default: '',
  placeholder: 'USDC',
  description: 'The asset to repay',
},
{
  displayName: 'Amount',
  name: 'repayAmount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['repay'] } },
  default: '',
  placeholder: '500.25',
  description: 'The amount to repay',
},
{
  displayName: 'User Address',
  name: 'repayUserAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['repay'] } },
  default: '',
  placeholder: '0x...',
  description: 'The user wallet address for repayment',
},
{
  displayName: 'User Address',
  name: 'healthUserAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['getHealthFactor'] } },
  default: '',
  placeholder: '0x...',
  description: 'The user wallet address to check health factor for',
},
{
  displayName: 'Vault ID',
  name: 'vaultId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['getHealthFactor'] } },
  default: '',
  placeholder: '1',
  description: 'The vault ID to check health factor for',
},
{
  displayName: 'Collateral',
  name: 'limitsCollateral',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['getBorrowLimits'] } },
  default: '',
  placeholder: 'ETH',
  description: 'The collateral asset to check limits for',
},
{
  displayName: 'User Address',
  name: 'limitsUserAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['borrowing'], operation: ['getBorrowLimits'] } },
  default: '',
  placeholder: '0x...',
  description: 'The user wallet address to check limits for',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationOpportunities'],
    },
  },
  options: [
    {
      name: 'Ethereum Mainnet',
      value: 'ethereum',
    },
    {
      name: 'Arbitrum',
      value: 'arbitrum',
    },
    {
      name: 'Polygon',
      value: 'polygon',
    },
  ],
  default: 'ethereum',
  description: 'Blockchain network to query',
},
{
  displayName: 'Min Profit',
  name: 'minProfit',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationOpportunities'],
    },
  },
  default: '',
  description: 'Minimum profit threshold for liquidation opportunities',
},
{
  displayName: 'Target User',
  name: 'targetUser',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['executeLiquidation'],
    },
  },
  default: '',
  description: 'Address of the user whose position will be liquidated',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['executeLiquidation', 'getLiquidationPenalties'],
    },
  },
  default: '',
  description: 'Asset address or symbol',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['executeLiquidation'],
    },
  },
  default: '',
  description: 'Amount to liquidate',
},
{
  displayName: 'Timeframe',
  name: 'timeframe',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationHistory'],
    },
  },
  options: [
    {
      name: '24 Hours',
      value: '24h',
    },
    {
      name: '7 Days',
      value: '7d',
    },
    {
      name: '30 Days',
      value: '30d',
    },
    {
      name: '90 Days',
      value: '90d',
    },
  ],
  default: '24h',
  description: 'Time period for historical data',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationHistory', 'getPositionHealth'],
    },
  },
  default: '',
  description: 'User address to filter data',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationPenalties'],
    },
  },
  default: '',
  description: 'Market identifier for penalty rates',
},
{
	displayName: 'Timeframe',
	name: 'timeframe',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getTotalValueLocked']
		}
	},
	options: [
		{ name: '1 Day', value: '1d' },
		{ name: '1 Week', value: '1w' },
		{ name: '1 Month', value: '1m' },
		{ name: '3 Months', value: '3m' },
		{ name: '1 Year', value: '1y' }
	],
	default: '1d',
	required: true,
	description: 'Time period for TVL data'
},
{
	displayName: 'Network',
	name: 'network',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getTotalValueLocked']
		}
	},
	options: [
		{ name: 'Ethereum Mainnet', value: 'ethereum' },
		{ name: 'All Networks', value: 'all' }
	],
	default: 'ethereum',
	description: 'Blockchain network for TVL data'
},
{
	displayName: 'Timeframe',
	name: 'timeframe',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getVolume']
		}
	},
	options: [
		{ name: '1 Day', value: '1d' },
		{ name: '1 Week', value: '1w' },
		{ name: '1 Month', value: '1m' },
		{ name: '3 Months', value: '3m' },
		{ name: '1 Year', value: '1y' }
	],
	default: '1d',
	required: true,
	description: 'Time period for volume data'
},
{
	displayName: 'Asset',
	name: 'asset',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getVolume']
		}
	},
	default: '',
	placeholder: 'USDC',
	description: 'Specific asset symbol for volume data (leave empty for all assets)'
},
{
	displayName: 'Timeframe',
	name: 'timeframe',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getRevenue']
		}
	},
	options: [
		{ name: '1 Day', value: '1d' },
		{ name: '1 Week', value: '1w' },
		{ name: '1 Month', value: '1m' },
		{ name: '3 Months', value: '3m' },
		{ name: '1 Year', value: '1y' }
	],
	default: '1d',
	required: true,
	description: 'Time period for revenue data'
},
{
	displayName: 'Breakdown',
	name: 'breakdown',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getRevenue']
		}
	},
	options: [
		{ name: 'Total', value: 'total' },
		{ name: 'By Asset', value: 'asset' },
		{ name: 'By Market', value: 'market' }
	],
	default: 'total',
	description: 'How to break down revenue data'
},
{
	displayName: 'Timeframe',
	name: 'timeframe',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getUserMetrics']
		}
	},
	options: [
		{ name: '1 Day', value: '1d' },
		{ name: '1 Week', value: '1w' },
		{ name: '1 Month', value: '1m' },
		{ name: '3 Months', value: '3m' },
		{ name: '1 Year', value: '1y' }
	],
	default: '1d',
	required: true,
	description: 'Time period for user metrics'
},
{
	displayName: 'Metric',
	name: 'metric',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getUserMetrics']
		}
	},
	options: [
		{ name: 'Active Users', value: 'active' },
		{ name: 'New Users', value: 'new' },
		{ name: 'Total Users', value: 'total' }
	],
	default: 'active',
	description: 'Type of user metric to retrieve'
},
{
	displayName: 'Asset',
	name: 'asset',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getAPYData']
		}
	},
	default: '',
	required: true,
	placeholder: 'USDC',
	description: 'Asset symbol for APY data'
},
{
	displayName: 'Timeframe',
	name: 'timeframe',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getAPYData']
		}
	},
	options: [
		{ name: '1 Day', value: '1d' },
		{ name: '1 Week', value: '1w' },
		{ name: '1 Month', value: '1m' },
		{ name: '3 Months', value: '3m' },
		{ name: '1 Year', value: '1y' }
	],
	default: '1d',
	required: true,
	description: 'Time period for APY data'
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'vault':
        return [await executeVaultOperations.call(this, items)];
      case 'lending':
        return [await executeLendingOperations.call(this, items)];
      case 'borrowing':
        return [await executeBorrowingOperations.call(this, items)];
      case 'liquidation':
        return [await executeLiquidationOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeVaultOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eulerprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllVaults': {
          const network = this.getNodeParameter('network', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vaults`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              network,
              status: status !== 'all' ? status : undefined,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVault': {
          const vaultId = this.getNodeParameter('vaultId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vaults/${vaultId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createVault': {
          const collateral = this.getNodeParameter('collateral', i) as string;
          const borrowAsset = this.getNodeParameter('borrowAsset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/vaults`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              collateral,
              borrowAsset,
              amount,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateVault': {
          const vaultId = this.getNodeParameter('vaultId', i) as string;
          const collateralRatio = this.getNodeParameter('collateralRatio', i) as string;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/vaults/${vaultId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              collateralRatio,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteVault': {
          const vaultId = this.getNodeParameter('vaultId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/vaults/${vaultId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLendingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eulerprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseOptions: any = {
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json'
        },
        json: true
      };

      switch (operation) {
        case 'getMarkets': {
          const network = this.getNodeParameter('network', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          
          const queryParams = new URLSearchParams();
          if (network) queryParams.append('network', network);
          if (asset) queryParams.append('asset', asset);
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/lending/markets?${queryParams.toString()}`
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPositions': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('userAddress', userAddress);
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/lending/positions?${queryParams.toString()}`
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deposit': {
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/lending/deposit`,
            body: {
              asset,
              amount,
              userAddress
            }
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'withdraw': {
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/lending/withdraw`,
            body: {
              asset,
              amount,
              userAddress
            }
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRates': {
          const asset = this.getNodeParameter('asset', i) as string;
          const market = this.getNodeParameter('market', i) as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('asset', asset);
          if (market) queryParams.append('market', market);
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/lending/rates?${queryParams.toString()}`
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBorrowingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eulerprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getBorrowPositions': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/borrowing/positions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              userAddress,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'borrow': {
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const collateral = this.getNodeParameter('collateral', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/borrowing/borrow`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              asset,
              amount,
              collateral,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'repay': {
          const asset = this.getNodeParameter('repayAsset', i) as string;
          const amount = this.getNodeParameter('repayAmount', i) as string;
          const userAddress = this.getNodeParameter('repayUserAddress', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/borrowing/repay`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              asset,
              amount,
              userAddress,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getHealthFactor': {
          const userAddress = this.getNodeParameter('healthUserAddress', i) as string;
          const vaultId = this.getNodeParameter('vaultId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/borrowing/health`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              userAddress,
              vaultId,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBorrowLimits': {
          const collateral = this.getNodeParameter('limitsCollateral', i) as string;
          const userAddress = this.getNodeParameter('limitsUserAddress', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/borrowing/limits`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              collateral,
              userAddress,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLiquidationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eulerprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLiquidationOpportunities': {
          const network = this.getNodeParameter('network', i, 'ethereum') as string;
          const minProfit = this.getNodeParameter('minProfit', i, '') as string;
          
          const params: any = {};
          if (network) params.network = network;
          if (minProfit) params.minProfit = minProfit;
          
          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/liquidations/opportunities${queryString ? '?' + queryString : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'executeLiquidation': {
          const targetUser = this.getNodeParameter('targetUser', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/liquidations/execute`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              targetUser,
              asset,
              amount,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLiquidationHistory': {
          const timeframe = this.getNodeParameter('timeframe', i, '24h') as string;
          const userAddress = this.getNodeParameter('userAddress', i, '') as string;
          
          const params: any = {};
          if (timeframe) params.timeframe = timeframe;
          if (userAddress) params.userAddress = userAddress;
          
          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/liquidations/history${queryString ? '?' + queryString : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPositionHealth': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          
          const params: any = {};
          if (userAddress) params.userAddress = userAddress;
          
          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/liquidations/health${queryString ? '?' + queryString : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLiquidationPenalties': {
          const asset = this.getNodeParameter('asset', i) as string;
          const market = this.getNodeParameter('market', i, '') as string;
          
          const params: any = {};
          if (asset) params.asset = asset;
          if (market) params.market = market;
          
          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/liquidations/penalties${queryString ? '?' + queryString : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAnalyticsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('eulerprotocolApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getTotalValueLocked': {
					const timeframe = this.getNodeParameter('timeframe', i) as string;
					const network = this.getNodeParameter('network', i) as string;

					const queryParams = new URLSearchParams({
						timeframe,
						network
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/tvl?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getVolume': {
					const timeframe = this.getNodeParameter('timeframe', i) as string;
					const asset = this.getNodeParameter('asset', i) as string;

					const queryParams = new URLSearchParams({ timeframe });
					if (asset) {
						queryParams.append('asset', asset);
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/volume?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getRevenue': {
					const timeframe = this.getNodeParameter('timeframe', i) as string;
					const breakdown = this.getNodeParameter('breakdown', i) as string;

					const queryParams = new URLSearchParams({
						timeframe,
						breakdown
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/revenue?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserMetrics': {
					const timeframe = this.getNodeParameter('timeframe', i) as string;
					const metric = this.getNodeParameter('metric', i) as string;

					const queryParams = new URLSearchParams({
						timeframe,
						metric
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/users?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAPYData': {
					const asset = this.getNodeParameter('asset', i) as string;
					const timeframe = this.getNodeParameter('timeframe', i) as string;

					const queryParams = new URLSearchParams({
						asset,
						timeframe
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/apy?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i }
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i }
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
