import { PodiumChart } from '../src/PodiumChart';
import { TestUtils } from './test-utils';
window.customElements.define('podium-chart', PodiumChart);

describe('<podium-chart>', () => {
    it('should render', async () => {
        const {shadowRoot} = await TestUtils.render(PodiumChart.tag, {
            source: '/demo/api/podium.json',
            width: 430,
            height: 200,
            "stroke-color": 'green',
            stylesheet: '/demo/cdn/podium.css'
        });

        expect(shadowRoot.querySelector("link[rel='stylesheet'][href='/demo/cdn/podium.css'") !== null).toBeTrue;

        expect(shadowRoot.querySelector('.moving-point') !== null).toBeTrue;
        expect(shadowRoot.querySelector('polyline').getAttribute('points')).toEqual('0,120 140,120 143,80 283,80 286,140 429,140');

        const places = shadowRoot.querySelectorAll('.places .place');
        expect(places.length).toEqual(3);
        expect(places[0].getAttribute('style')).toEqual('height: calc(100% - 120px)');
        expect(places[0].innerHTML).toContain('114');
        expect(places[1].getAttribute('style')).toEqual('height: calc(100% - 80px)');
        expect(places[1].innerHTML).toContain('184');
        expect(places[2].getAttribute('style')).toEqual('height: calc(100% - 140px)');
        expect(places[2].innerHTML).toContain('107');
    });
});