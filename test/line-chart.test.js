import { LineChart } from '../src/LineChart';
import { TestUtils } from './test-utils';
window.customElements.define('line-chart', LineChart);

describe('<line-chart>', () => {
    it('should render', async () => {
        const {shadowRoot} = await TestUtils.render(LineChart.tag, {
            source: '/demo/api/velocities.json',
            scaling: 4,
            width: 300,
            height: 160,
            "unit-x": '%'
        });
        const axis = shadowRoot.querySelectorAll('.x-axis, .y-axis');
        expect(axis.length).toEqual(2);

        expect(shadowRoot.querySelector('.y-axis div:nth-child(1)').getAttribute('style')).toEqual('position: absolute; bottom: 0');
        expect(shadowRoot.querySelector('.y-axis div:nth-child(2)').getAttribute('style')).toEqual('position: absolute; bottom: 115px');
        expect(shadowRoot.querySelector('.y-axis div:nth-child(3)').getAttribute('style')).toEqual('position: absolute; bottom: 150px');

        expect(shadowRoot.querySelector('svg polyline:nth-child(1)').getAttribute('points')).toEqual('0,160 30,85 60,50 90,45 210,45 ');
        expect(shadowRoot.querySelector('svg polyline:nth-child(1)').getAttribute('stroke')).toEqual('#555594');
        expect(shadowRoot.querySelector('svg polyline:nth-child(2)').getAttribute('points')).toEqual('0,160 30,60 60,10 90,10 210,10 ');
        expect(shadowRoot.querySelector('svg polyline:nth-child(2)').getAttribute('stroke')).toEqual('#28dcc5');
        expect(shadowRoot.querySelector('svg polyline:nth-child(3)').getAttribute('points')).toEqual('0,160 30,125 60,125 90,130 210,130 ');
        expect(shadowRoot.querySelector('svg polyline:nth-child(3)').getAttribute('stroke')).toEqual('#b1196b');

        expect(shadowRoot.querySelector('.x-axis div:nth-child(1)').innerHTML).toEqual('70 %');
    });
});