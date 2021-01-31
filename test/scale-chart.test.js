import { ScaleChart } from '../src/ScaleChart';
import { TestUtils } from './test-utils';
window.customElements.define('scale-chart', ScaleChart);

describe('<scale-chart>', () => {
    it('should render', async () => {
        const {shadowRoot} = await TestUtils.render(ScaleChart.tag, {
            width: 430,
            height: 100,
            choose: 9
        });

        const squares = shadowRoot.querySelectorAll('.square');
        expect(squares.length).toEqual(10);

        expect(squares[0].getAttribute('style')).toEqual('opacity: 0.3');
        expect(squares[1].getAttribute('style')).toEqual('opacity: 0.3');
        expect(squares[2].getAttribute('style')).toEqual('opacity: 0.4');
        expect(squares[3].getAttribute('style')).toEqual('opacity: 0.5');
        expect(squares[4].getAttribute('style')).toEqual('opacity: 0.6');
        expect(squares[5].getAttribute('style')).toEqual('opacity: 0.7');
        expect(squares[6].getAttribute('style')).toEqual('opacity: 0.8');
        expect(squares[7].getAttribute('style')).toEqual('opacity: 0.9');
        expect(squares[8].getAttribute('style')).toEqual('opacity: 1.0');
        expect(squares[9].getAttribute('style')).toEqual('opacity: 0.9');
    });
});
