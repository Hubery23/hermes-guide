export const compatPairs = [
	{ from: 'Skills', fromMeta: '/skills/*', to: 'Skills System', toMeta: 'hub-installable' },
	{ from: 'Integrations', fromMeta: '50+ services', to: 'Toolsets + MCP', toMeta: 'composable' },
	{ from: 'Heartbeats', fromMeta: 'cron-like', to: 'Scheduled Tasks', toMeta: 'natural-lang' },
	{ from: 'Persistent Memory', fromMeta: '24/7 ctx', to: 'Memory System', toMeta: 'auto-compact' },
	{ from: 'Bot Framework', fromMeta: 'multi-channel', to: 'Messaging Platforms', toMeta: 'plugin-based' },
] as const;
