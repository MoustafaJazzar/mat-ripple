import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const input = 'src/index.ts';

const plugins = format => {
	const _plugins = [];

	_plugins.push(typescript({ useTsconfigDeclarationDir: true }));

	if (format === 'umd') {
		_plugins.push(terser());
	}

	return _plugins;
};

export default [
	{
		input,
		output: [
			{
				file: pkg.module,
				format: 'esm'
			},
			{
				file: pkg.main,
				format: 'cjs'
			}
		],
		plugins: plugins()
	},
	{
		input,
		output: [
			{
				file: pkg.browser,
				format: 'umd',
				name: 'MatRipple'
			}
		],
		plugins: plugins('umd')
	}
];
