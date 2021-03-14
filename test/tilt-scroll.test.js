import { TiltScroll } from '../src/TiltScroll';
import { TestUtils } from './test-utils';
window.customElements.define('tilt-scroll', TiltScroll);

describe('<tilt-scroll>', () => {
    it('should render', async () => {
        const {shadowRoot} = await TestUtils.render(TiltScroll.tag, {
            width: '200',
            height: '200',
            styleString: "background: red;"
        });

        expect(shadowRoot.querySelectorAll('.tilt-scroll-point-bottom').length).toEqual(1);
        const tiltScroll = shadowRoot.querySelector('#tilt-scroll');
        expect(tiltScroll.getAttribute('style')).toEqual('background: red;');

        TiltScroll.prototype.transform(tiltScroll, 0.7, 100);
        expect(tiltScroll.getAttribute('style')).toEqual('background: red; transform: perspective(100px) rotateX(0.7deg);')
    });

    it('should get transformation', () => {
        expect(TiltScroll.prototype.getAngle(.32, true)).toEqual(-0.5);
        expect(TiltScroll.prototype.getAngle(0, false)).toEqual(4);
        expect(TiltScroll.prototype.getAngle(.1, false)).toEqual(3.7);
        expect(TiltScroll.prototype.getAngle(.01, false)).toEqual(4);
        expect(TiltScroll.prototype.getAngle(.19, false)).toEqual(1.6);
        expect(TiltScroll.prototype.getAngle(.32, false)).toEqual(0.5);
        expect(TiltScroll.prototype.getAngle(.20, false)).toEqual(1.6);
        expect(TiltScroll.prototype.getAngle(.30, false)).toEqual(0.7);
        expect(TiltScroll.prototype.getAngle(.39, false)).toEqual(0.3);
        expect(TiltScroll.prototype.getAngle(.4, false)).toEqual(0.3);
        expect(TiltScroll.prototype.getAngle(.41, false)).toEqual(0);
    });
});
