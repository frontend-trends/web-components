export class DonutChart extends HTMLElement {
    static get tag() {
        return "donut-chart";
    }

    constructor() {
        super();
        this.highlightClass = 'highlight';
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const attributes = this.getAttributes(this);

        if (attributes.source) {
            fetch(attributes.source).then(response => response.json()).then(data => {
                attributes.data = data;
                attributes.data = this.sortItems(attributes.data);
                this.createShadowDom(shadowRoot, attributes);
            });
        } else {
            attributes.data = this.sortItems(attributes.data);
            this.createShadowDom(shadowRoot, attributes);
        }
    }

    disconnectedCallback() {
    
    }

    createShadowDom(shadowRoot, attributes) {
        const styleNode = `
        <style type="text/css">
            #donut-chart {
                ${attributes.legendPositon === 'right' ? 'display: flex;' : ''}
            }

            @media screen and (max-width: 600px) {
                #donut-chart {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            }

            .circle {
                stroke-dasharray: 0;
                stroke-dashoffset: ${attributes.perimeter};
                transition: stroke-dashoffset .3s ease;
            }

            .circle.highlight {
                stroke: ${attributes.highlightColor};
            }

            .legend {
                margin-left: 15px;
                padding-top: 20px;
                user-select: none;
                cursor: pointer;
            }

            .name-item {
                display: inline-flex;
                align-items: center;
                margin-bottom: 5px;
                white-space: nowrap;
                padding: 0 3px;
            }

            .name-item.highlight {
                background: ${attributes.highlightColor};
            }

            .square {
                border: 1px solid;
                width: 10px;
                height: 10px;
                margin-right: 10px;
            }
        </style>`;

        shadowRoot.innerHTML = styleNode + this.getHtml(this.processChartData(attributes.data), attributes.strokeWidth, attributes.radius, attributes.size);

        const circles = shadowRoot.querySelectorAll('.circle');
        const nameItems = shadowRoot.querySelectorAll('.name-item');

        setTimeout(() => {
            this.animate(circles, attributes.perimeter);
        }, 100);

        nameItems.forEach((nameItem, index) => {
            nameItem.addEventListener('click', (e) => {
                const toggleCondition = e.currentTarget.classList.contains(this.highlightClass);
                this.unHighlightAllChartItems(shadowRoot.querySelectorAll(`.${this.highlightClass}`));
                this.highlightChartItem(e.currentTarget, circles[index], toggleCondition);
            });
        });

        this.setAttribute('connected', true);
    }

    unHighlightAllChartItems(highlightedElements) {
        highlightedElements.forEach((highlightedElement) => {
            highlightedElement.classList.remove(this.highlightClass);
        });
    }

    highlightChartItem(nameItem, circle, toggleCondition) {
        circle.classList.toggle(this.highlightClass, !toggleCondition);
        nameItem.classList.toggle(this.highlightClass, !toggleCondition);
    }

    animate(circles, perimeter) {
        circles.forEach((circle) => {
            circle.style.strokeDasharray = `${perimeter}px`;
            circle.style.strokeDashoffset = `${this.getFillAmount(parseFloat(circle.getAttribute('data-fill')), perimeter)}px`;
        });
    }

    sortItems(array) {
        if (!array) {
            return [];
        }
        return array.sort((a, b) => b.percent - a.percent);
    }

    getAttributes(element) {
        const attributes = {};
        attributes.data = JSON.parse(element.getAttribute('data'));
        attributes.source = element.getAttribute('source');
        attributes.legendPositon = element.getAttribute('legend') || 'bottom';
        attributes.radius = parseInt(element.getAttribute('radius')) || 40;
        attributes.strokeWidth = parseInt(element.getAttribute('stroke-width')) || 20;
        attributes.highlightColor = element.getAttribute('highlight') || '#a8d1ff';
        attributes.size = {
            width: parseInt(element.getAttribute('width')) || 250,
            height: parseInt(element.getAttribute('height')) ||250
        };
        attributes.perimeter = parseFloat(2 * 3.14 * attributes.radius).toFixed(2);
        return attributes;
    }

    processChartData(config) {
        let sumOfRest;
        const chartData = [];
        while (config[0]) {
            sumOfRest = 0;
            config.forEach((part) => {
                sumOfRest += parseFloat(part.percent);
            })
            chartData.push({
                color: config[0].color,
                name: config[0].name,
                originPercent: config[0].percent,
                percent: sumOfRest
            })
            config.shift();
        }
        return chartData;
    }

    getFillAmount(amount, perimeter) {
        return parseFloat(perimeter - perimeter * amount / 100).toFixed(2);
    }

    getHtml(chartData, strokeWidth, radius, size) {
        let nameItems = '';
        const center = {
            x: 50,
            y: 50
        };
       
        return `
        <div id="donut-chart">
            <svg width="${size.height}" height="${size.width}" viewbox="0 0 100 100">
                <circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="#eee" id="radius"/>
                <circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="transparent" stroke-width="${strokeWidth}" stroke="grey"/>
                ${chartData.map((item) => {
                    nameItems += `<div class="name-item"><div class="square" style="background:${item.color}; border-color: ${item.color}"></div>${item.name}&nbsp;&nbsp;${item.originPercent} %</div><br/>`;
                    return `<circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="transparent" stroke-width="${strokeWidth}" stroke="${item.color}" data-fill="${item.percent}" class="circle"/>`;
                }).join('')}
            </svg>
            <div class="legend">${nameItems}</div>
        </div>
        `;
    }
}
