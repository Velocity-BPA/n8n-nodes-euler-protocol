import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class EulerProtocolApi implements ICredentialType {
	name = 'eulerProtocolApi';
	displayName = 'Euler Protocol API';
	documentationUrl = 'https://docs.euler.finance/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for Euler Protocol API access',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.euler.finance/v1',
			required: true,
			description: 'Base URL for the Euler Protocol API',
		},
	];
}