import { LabeledInput } from '../src/LabeledInput';
import { TestUtils } from './test-utils';
window.customElements.define('labeled-input', LabeledInput);

describe('<labeled-input>', () => {
    it('should render', async () => {
        const {shadowRoot} = await TestUtils.render(LabeledInput.tag, {
            width: 430,
            height: 30,
            value: '2',
            type: 'number',
            'placeholder-style': 'font-size: 10px; color: green',
            'input-style': 'border: 1px solid black; padding: 10px',
            foo: 'bar'
        });

        const placeholders = shadowRoot.querySelectorAll('.placeholder');
        expect(placeholders.length).toBe(1);
        expect(placeholders[0].getAttribute('style')).toEqual('font-size: 10px; color: green');
        expect(placeholders[0].classList.contains('quick-up')).toBeTrue;

        const inputs = shadowRoot.querySelectorAll('input');
        expect(inputs.length).toBe(1);
        expect(inputs[0].getAttribute('style')).toEqual('border: 1px solid black; padding: 10px');
        expect(inputs[0].getAttribute('width')).toEqual('430');
        expect(inputs[0].getAttribute('height')).toEqual('30');
        expect(inputs[0].getAttribute('type')).toEqual('number');
        expect(inputs[0].getAttribute('value')).toEqual('2');
        expect(inputs[0].getAttribute('foo')).toEqual('bar');
    });
});
