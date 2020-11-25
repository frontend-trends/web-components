import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { uglify } from "rollup-plugin-uglify";

const bundle1 = {
  input: ['./donut-chart.js'],
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      runtimeHelpers: true
    }),
    uglify()
  ],
  output: [
    { file: './dist/donut-chart.min.js', format: 'cjs' }
  ]
};

const bundle2 = {
  input: './bar-chart.js',
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      runtimeHelpers: true
    }),
    uglify()
  ],
  output: [
    { file: './dist/bar-chart.min.js', format: 'cjs' }
  ]
};

const bundle3 = {
  input: './line-chart.js',
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      runtimeHelpers: true
    }),
    uglify()
  ],
  output: [
    { file: './dist/line-chart.min.js', format: 'cjs' }
  ]
};

const bundle4 = {
  input: './podium-chart.js',
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      runtimeHelpers: true
    }),
    uglify()
  ],
  output: [
    { file: './dist/podium-chart.min.js', format: 'cjs' }
  ]
};

export default [
  bundle1,
  bundle2,
  bundle3,
  bundle4
]