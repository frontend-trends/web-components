import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { uglify } from "rollup-plugin-uglify";

const config = {
  input: ['./donut-chart.js', './bar-chart.js', './line-chart.js', './podium-chart.js', './scale-chart.js', './labeled-input.js'],
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      runtimeHelpers: true
    }),
    uglify()
  ],
  output: [
    {
      dir: './dist',
      format: 'cjs',
      entryFileNames: '[name].min.js'
    }
  ]
};

export default config;