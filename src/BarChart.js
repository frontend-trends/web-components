export class BarChart extends HTMLElement {
    static get tag() {
        return "bar-chart";
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const attributes = this.getAttributes(this);
        if (attributes.source) {
            fetch(attributes.source).then(response => response.json()).then(data => {
                attributes.data = data;
                this.createShadowDom(shadowRoot, attributes);
            });
        } else {
            this.createShadowDom(shadowRoot, attributes);
        }
    }

    disconnectedCallback() {
    
    }
    
    createShadowDom(shadowRoot, attributes) {
        const styleNode = `
        <style type="text/css">
        @keyframes animate-height {
            0% {
              height: 0;
            }
            100% {
              visibility: visible;
            }
        }

        .bar-chart-data {
            display: flex;
            width: ${attributes.width}px;
            height: ${attributes.height}px;
        }

        @media screen and (max-width: 600px) {
            #bar-chart {
                display: block;
            }

            .legend {
                margin-left: 0 !important;
            }
        }

        .chart-data {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            height: 100%;
        }

        .bar-group {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            height: 100%;
        }

        .bar-group:only-child {
            width: 100%;
        }

        .bar-group-name {
            position: absolute;
            top: calc(100% + 10px);
            line-height: 10px;
            left: 50%;
            transform: translateX(-50%);
        }

        .bar {
            animation: animate-height;
            animation-timing-function: cubic-bezier(.35,.95,.67,.99);
            animation-duration: .8s;
            animation-fill-mode: forwards;
            height: 0;
            width: ${attributes.barWidth}px;
        }

        .legend {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            padding-top: 30px;
            user-select: none;
            max-width: ${attributes.width}px;
        }

        .name-item {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            margin-left: 8px;
            padding: 0 3px;
        }

        .square {
            border: 1px solid;
            width: 10px;
            height: 10px;
            margin-right: 10px;
        }

        .y-axis {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            margin-right: 15px;
            line-height: 0;
        }
        </style>`;

        shadowRoot.innerHTML = styleNode + this.getHtml(attributes.data, attributes.unit);

        this.setAttribute('connected', true);
    }

    getAttributes(element) {
        const attributes = {};
        attributes.data = JSON.parse(element.getAttribute('data'));
        attributes.source = element.getAttribute('source');
        attributes.barWidth = parseInt(element.getAttribute('bar-width')) || 20;
        attributes.height = parseInt(element.getAttribute('height')) || 200;
        attributes.width = parseInt(element.getAttribute('width')) || 200;
        attributes.unit = element.getAttribute('unit') || '';
        return attributes;
    }

    getMaxAmount(chartData) {
        let maximum = 0;
        chartData.forEach((item) => {
            item.group.forEach((bar) => {
                if (bar.amount > maximum) {
                    maximum = bar.amount;
                }
            })
        });
        return maximum;
    }

    getBarHeight(maxAmount, amount) {
        return `${100 / maxAmount * amount}%`;
    }

    getHtml(chartData, unit) {
        let legendDom = '';
        const nameItems = [];
        const maxAmount = this.getMaxAmount(chartData);
        return `
        <div id="bar-chart">
            <div class="bar-chart-data">
                <div class="y-axis">
                    <div>${maxAmount}</div>
                    <div>${parseInt(maxAmount / 2)}</div>
                    <div>0</div>
                </div>
                <div class="chart-data">
                    ${chartData.map((item) => {
                        return `<div class="bar-group">
                        ${item.group.map((bar) => {
                            if (!nameItems.includes(bar.name)) {
                                nameItems.push(bar.name);
                                legendDom += `<div class="name-item"><div class="square" style="background:${bar.color}; border-color: ${bar.color}"></div>${bar.name}</div><br/>`;
                            }
                            return `<div class="bar" title="${bar.name} ${bar.amount} ${unit}" style="height: ${this.getBarHeight(maxAmount, bar.amount)}; background: ${bar.color};"></div>`;
                        }).join('')}
                        <div class="bar-group-name">${item.name}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
            <div class="legend">${legendDom}</div>
        </div> 
        `;
    }
}
