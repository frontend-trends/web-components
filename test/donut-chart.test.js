import { DonutChart } from '../src/DonutChart';
import { TestUtils } from './test-utils';
window.customElements.define('donut-chart', DonutChart);

describe('<donut-chart>', () => {
    it('should render', async () => {
        const {shadowRoot} = await TestUtils.render(DonutChart.tag, {
            source: '/demo/api/agreements.json',
            width: 200,
            height: 200,
            radius: 40,
            'middle-color': 'yellow',
            'middle-text': 'Cars',
            'middle-text-color': 'blue',
            'middle-text-size': '15px',
            'stroke-width': 20,
            'legend': "right"
        });
        const circles = shadowRoot.querySelectorAll('circle.circle');
        expect(circles.length).toEqual(2);
        circles.forEach((circle) => {
            expect(circle.getAttribute('stroke-width')).toEqual('20');
            expect(circle.getAttribute('r')).toEqual('40');
            expect(circle.getAttribute('cx')).toEqual('50');
            expect(circle.getAttribute('cy')).toEqual('50');
        });
        expect(circles[0].getAttribute('stroke')).toEqual('#555594');
        expect(circles[0].getAttribute('data-fill')).toEqual('90');
        expect(circles[1].getAttribute('stroke')).toEqual('#28dcc5');
        expect(circles[1].getAttribute('data-fill')).toEqual('10');

        await TestUtils.sleep(100);
        expect(circles[0].getAttribute('style')).toEqual('stroke-dashoffset: 25.12px;');
        expect(circles[1].getAttribute('style')).toEqual('stroke-dashoffset: 226.08px;');

        // legend start
        const legendItems = shadowRoot.querySelectorAll('.legend .name-item');
        expect(legendItems.length).toEqual(2);
        expect(shadowRoot.querySelectorAll('.legend .name-item.highlight').length).toEqual(0);
        expect(legendItems[0].textContent).toEqual('Strongly agree  80 %');
        expect(legendItems[1].textContent).toEqual('Somewhat agree  10 %');

        legendItems[0].click();
        expect(legendItems[0].classList.contains('highlight')).toBeTrue;
        legendItems[0].click();
        expect(legendItems[0].classList.contains('highlight')).toBeFalse;

        legendItems[0].click();
        legendItems[1].click();
        expect(legendItems[0].classList.contains('highlight')).toBeFalse;
        expect(legendItems[1].classList.contains('highlight')).toBeTrue;
        // legend end

        const middleText = shadowRoot.querySelector('text');
        expect(middleText.innerHTML).toEqual('Cars');

        const radius = shadowRoot.getElementById('radius');
        expect(radius.getAttribute('fill')).toEqual('yellow');
    });

    it('should sort and apply default atributes', async () => {
        const {shadowRoot} = await TestUtils.render(DonutChart.tag, {
            data: JSON.stringify([
                {
                    color: '#555594',
                    percent: 40,
                    name: 'Strongly agree'
                },
                {
                    color: '#28dcc5',
                    percent: 50,
                    name: 'Somewhat agree'
                }
            ])
        });
        const circles = shadowRoot.querySelectorAll('circle.circle');
        expect(circles.length).toEqual(2);
        circles.forEach((circle) => {
            expect(circle.getAttribute('stroke-width')).toEqual('20');
            expect(circle.getAttribute('r')).toEqual('40');
            expect(circle.getAttribute('cx')).toEqual('50');
            expect(circle.getAttribute('cy')).toEqual('50');
        });
        expect(circles[0].getAttribute('data-fill')).toEqual('90');
        expect(circles[0].getAttribute('stroke')).toEqual('#28dcc5');
        expect(circles[1].getAttribute('data-fill')).toEqual('40');
        expect(circles[1].getAttribute('stroke')).toEqual('#555594');

        await TestUtils.sleep(100);
        expect(circles[0].getAttribute('style')).toEqual('stroke-dashoffset: 25.12px;');
        expect(circles[1].getAttribute('style')).toEqual('stroke-dashoffset: 150.72px;');

        const legendItems = shadowRoot.querySelectorAll('.legend .name-item');
        expect(legendItems.length).toEqual(2);
        expect(legendItems[0].textContent).toEqual('Somewhat agree  50 %');
        expect(legendItems[1].textContent).toEqual('Strongly agree  40 %');

        expect(shadowRoot.querySelectorAll('text').length).toEqual(0);
        const radius = shadowRoot.getElementById('radius');
        expect(radius.getAttribute('fill')).toEqual('#eee');
    });

    it('Should calculate the fill amount', () => {
        const donutChart = new DonutChart();
        expect(donutChart.getFillAmount(100, 251.2)).toEqual('0.00');
        expect(donutChart.getFillAmount(90, 251.2)).toEqual('25.12');
        expect(donutChart.getFillAmount(50, 251.2)).toEqual('125.60');
        expect(donutChart.getFillAmount(0, 251.2)).toEqual('251.20');
    });

    it('Should process chart data', () => {
        const donutChart = new DonutChart();
        let chartConfig = [
            {
                "color": "#555594",
                "percent": 80,
                "name": "Strongly agree"
            }
        ];
        expect(donutChart.processChartData(chartConfig)).toEqual([
            {
                "color": "#555594",
                "name": "Strongly agree",
                "originPercent": 80,
                "percent": 80
            }
        ]);

        chartConfig = [
            {
                "color": "#555594",
                "percent": 60,
                "name": "Strongly agree"
            },
            {
                "color": "blue",
                "percent": 30,
                "name": "Somewhat agree"
            }
        ];
        expect(donutChart.processChartData(chartConfig)).toEqual([
            {
                "color": "#555594",
                "name": "Strongly agree",
                "originPercent": 60,
                "percent": 90
            },
            {
                "color": "blue",
                "name": "Somewhat agree",
                "originPercent": 30,
                "percent": 30
            }
        ]);

        chartConfig = [
            {
                "color": "#555594",
                "percent": 0.5,
                "name": "Strongly agree"
            },
            {
                "color": "blue",
                "percent": 0.2,
                "name": "Somewhat agree"
            }
        ];
        expect(donutChart.processChartData(chartConfig)).toEqual([
            {
                "color": "#555594",
                "name": "Strongly agree",
                "originPercent": 0.5,
                "percent": 0.7
            },
            {
                "color": "blue",
                "name": "Somewhat agree",
                "originPercent": 0.2,
                "percent": 0.2
            }
        ]);
    });
});