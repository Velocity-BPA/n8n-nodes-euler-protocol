/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { EulerProtocol } from '../nodes/Euler Protocol/Euler Protocol.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('EulerProtocol Node', () => {
  let node: EulerProtocol;

  beforeAll(() => {
    node = new EulerProtocol();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Euler Protocol');
      expect(node.description.name).toBe('eulerprotocol');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Vault Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.euler.finance/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAllVaults', () => {
    it('should get all vaults successfully', async () => {
      const mockVaults = { vaults: [{ id: '1', status: 'active' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllVaults')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('active');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockVaults);

      const result = await executeVaultOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockVaults, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.euler.finance/v1/vaults',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: { network: 'mainnet', status: 'active' },
        json: true,
      });
    });

    it('should handle getAllVaults error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllVaults');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeVaultOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getVault', () => {
    it('should get specific vault successfully', async () => {
      const mockVault = { id: 'vault123', status: 'active' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getVault')
        .mockReturnValueOnce('vault123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockVault);

      const result = await executeVaultOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockVault, pairedItem: { item: 0 } }]);
    });
  });

  describe('createVault', () => {
    it('should create vault successfully', async () => {
      const mockCreatedVault = { id: 'new-vault', status: 'active' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createVault')
        .mockReturnValueOnce('ETH')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce('100');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCreatedVault);

      const result = await executeVaultOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockCreatedVault, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateVault', () => {
    it('should update vault successfully', async () => {
      const mockUpdatedVault = { id: 'vault123', collateralRatio: '1.5' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateVault')
        .mockReturnValueOnce('vault123')
        .mockReturnValueOnce('1.5');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedVault);

      const result = await executeVaultOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockUpdatedVault, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteVault', () => {
    it('should delete vault successfully', async () => {
      const mockResponse = { success: true, message: 'Vault closed' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteVault')
        .mockReturnValueOnce('vault123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVaultOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Lending Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.euler.finance/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get lending markets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMarkets')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('ETH');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      markets: [{ asset: 'ETH', network: 'ethereum', apy: '4.5%' }]
    });

    const result = await executeLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.markets).toBeDefined();
  });

  it('should handle get markets error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMarkets')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('ETH');
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should get user positions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPositions')
      .mockReturnValueOnce('0x123...');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      positions: [{ asset: 'ETH', deposited: '1000000000000000000' }]
    });

    const result = await executeLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.positions).toBeDefined();
  });

  it('should deposit assets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deposit')
      .mockReturnValueOnce('ETH')
      .mockReturnValueOnce('1000000000000000000')
      .mockReturnValueOnce('0x123...');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      transactionHash: '0xabc...',
      status: 'success'
    });

    const result = await executeLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.status).toBe('success');
  });

  it('should withdraw assets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('withdraw')
      .mockReturnValueOnce('ETH')
      .mockReturnValueOnce('500000000000000000')
      .mockReturnValueOnce('0x123...');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      transactionHash: '0xdef...',
      status: 'success'
    });

    const result = await executeLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.status).toBe('success');
  });

  it('should get lending rates successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRates')
      .mockReturnValueOnce('ETH')
      .mockReturnValueOnce('main');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      asset: 'ETH',
      supplyRate: '4.5',
      borrowRate: '6.2'
    });

    const result = await executeLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.asset).toBe('ETH');
  });
});

describe('Borrowing Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.euler.finance/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getBorrowPositions', () => {
    it('should get borrow positions successfully', async () => {
      const mockResponse = { positions: [{ asset: 'USDC', amount: '1000' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getBorrowPositions';
        if (param === 'userAddress') return '0x123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBorrowingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getBorrowPositions error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getBorrowPositions';
        if (param === 'userAddress') return '0x123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBorrowingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('borrow', () => {
    it('should borrow assets successfully', async () => {
      const mockResponse = { transactionHash: '0xabc', success: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'borrow';
        if (param === 'asset') return 'USDC';
        if (param === 'amount') return '1000';
        if (param === 'collateral') return 'ETH';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBorrowingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('repay', () => {
    it('should repay assets successfully', async () => {
      const mockResponse = { transactionHash: '0xdef', success: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'repay';
        if (param === 'repayAsset') return 'USDC';
        if (param === 'repayAmount') return '500';
        if (param === 'repayUserAddress') return '0x123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBorrowingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getHealthFactor', () => {
    it('should get health factor successfully', async () => {
      const mockResponse = { healthFactor: '1.5', riskLevel: 'LOW' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getHealthFactor';
        if (param === 'healthUserAddress') return '0x123';
        if (param === 'vaultId') return '1';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBorrowingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBorrowLimits', () => {
    it('should get borrow limits successfully', async () => {
      const mockResponse = { maxBorrow: '5000', availableBorrow: '3000' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getBorrowLimits';
        if (param === 'limitsCollateral') return 'ETH';
        if (param === 'limitsUserAddress') return '0x123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBorrowingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Liquidation Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.euler.finance/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should get liquidation opportunities successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getLiquidationOpportunities';
      if (param === 'network') return 'ethereum';
      if (param === 'minProfit') return '100';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      opportunities: [{ user: '0x123', asset: 'USDC', profit: '150' }],
    });

    const items = [{ json: {} }];
    const result = await executeLiquidationOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.opportunities).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/liquidations/opportunities'),
      }),
    );
  });

  it('should execute liquidation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'executeLiquidation';
      if (param === 'targetUser') return '0x123';
      if (param === 'asset') return 'USDC';
      if (param === 'amount') return '1000';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      transactionHash: '0xabc123',
      liquidatedAmount: '1000',
    });

    const items = [{ json: {} }];
    const result = await executeLiquidationOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.transactionHash).toBe('0xabc123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/liquidations/execute'),
        body: expect.objectContaining({
          targetUser: '0x123',
          asset: 'USDC',
          amount: '1000',
        }),
      }),
    );
  });

  it('should get liquidation history successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getLiquidationHistory';
      if (param === 'timeframe') return '7d';
      if (param === 'userAddress') return '0x123';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      history: [{ timestamp: '2023-01-01', amount: '1000', asset: 'USDC' }],
    });

    const items = [{ json: {} }];
    const result = await executeLiquidationOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.history).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/liquidations/history'),
      }),
    );
  });

  it('should get position health successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getPositionHealth';
      if (param === 'userAddress') return '0x123';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      healthFactor: '1.5',
      liquidationRisk: 'low',
    });

    const items = [{ json: {} }];
    const result = await executeLiquidationOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.healthFactor).toBe('1.5');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/liquidations/health'),
      }),
    );
  });

  it('should get liquidation penalties successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getLiquidationPenalties';
      if (param === 'asset') return 'USDC';
      if (param === 'market') return 'ethereum';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      penalties: { liquidationPenalty: '0.05', reserveFactor: '0.1' },
    });

    const items = [{ json: {} }];
    const result = await executeLiquidationOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.penalties).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/liquidations/penalties'),
      }),
    );
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getLiquidationOpportunities';
      return '';
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeLiquidationOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getLiquidationOpportunities';
      return '';
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];

    await expect(
      executeLiquidationOperations.call(mockExecuteFunctions, items),
    ).rejects.toThrow('API Error');
  });
});

describe('Analytics Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.euler.finance/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	it('should get total value locked successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTotalValueLocked')
			.mockReturnValueOnce('1d')
			.mockReturnValueOnce('ethereum');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			tvl: '1000000.50',
			change_24h: '2.5%',
			timestamp: '2023-12-01T00:00:00Z'
		});

		const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.euler.finance/v1/analytics/tvl?timeframe=1d&network=ethereum',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});

		expect(result).toEqual([{
			json: {
				tvl: '1000000.50',
				change_24h: '2.5%',
				timestamp: '2023-12-01T00:00:00Z'
			},
			pairedItem: { item: 0 }
		}]);
	});

	it('should get volume data successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getVolume')
			.mockReturnValueOnce('1w')
			.mockReturnValueOnce('USDC');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			total_volume: '5000000.75',
			lending_volume: '3000000.25',
			trading_volume: '2000000.50'
		});

		const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.euler.finance/v1/analytics/volume?timeframe=1w&asset=USDC',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});

		expect(result[0].json.total_volume).toBe('5000000.75');
	});

	it('should get revenue data successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getRevenue')
			.mockReturnValueOnce('1m')
			.mockReturnValueOnce('asset');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			total_revenue: '100000.00',
			revenue_by_asset: {
				'USDC': '60000.00',
				'USDT': '40000.00'
			}
		});

		const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json.total_revenue).toBe('100000.00');
	});

	it('should get user metrics successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUserMetrics')
			.mockReturnValueOnce('1d')
			.mockReturnValueOnce('active');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			active_users: 1250,
			growth_rate: '5.2%'
		});

		const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json.active_users).toBe(1250);
	});

	it('should get APY data successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAPYData')
			.mockReturnValueOnce('USDC')
			.mockReturnValueOnce('1m');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			current_apy: '5.25',
			historical_data: [
				{ date: '2023-11-01', apy: '5.10' },
				{ date: '2023-11-15', apy: '5.20' },
				{ date: '2023-12-01', apy: '5.25' }
			]
		});

		const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json.current_apy).toBe('5.25');
		expect(result[0].json.historical_data).toHaveLength(3);
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getTotalValueLocked');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

		await expect(
			executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});
});
