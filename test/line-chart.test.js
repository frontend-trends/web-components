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

        expect(shadowRoot.querySelector('.y-axis div:nth-child(1)').getAttribute('style')).toEqual('position:absolute; top: 0');
        expect(shadowRoot.querySelector('.y-axis div:nth-child(2)').getAttribute('style')).toEqual('position:absolute; bottom:92px');
        expect(shadowRoot.querySelector('.y-axis div:nth-child(3)').getAttribute('style')).toEqual('position:absolute; bottom:120px');

        expect(shadowRoot.querySelector('svg polyline:nth-child(1)').getAttribute('points')).toEqual('0,160 40,100 80,72 120,68 280,68 ');
        expect(shadowRoot.querySelector('svg polyline:nth-child(1)').getAttribute('stroke')).toEqual('#555594');
        expect(shadowRoot.querySelector('svg polyline:nth-child(2)').getAttribute('points')).toEqual('0,160 40,80 80,40 120,40 280,40 ');
        expect(shadowRoot.querySelector('svg polyline:nth-child(2)').getAttribute('stroke')).toEqual('#28dcc5');
        expect(shadowRoot.querySelector('svg polyline:nth-child(3)').getAttribute('points')).toEqual('0,160 40,132 80,132 120,136 280,136 ');
        expect(shadowRoot.querySelector('svg polyline:nth-child(3)').getAttribute('stroke')).toEqual('#b1196b');

        expect(shadowRoot.querySelector('.x-axis div:nth-child(1)').innerHTML).toEqual('0');
        expect(shadowRoot.querySelector('.x-axis div:nth-child(2)').innerHTML).toEqual('70 %');
    });
});