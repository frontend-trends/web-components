export class PodiumChart extends HTMLElement {
    static get tag() {
        return "podium-chart";
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
        }
    }

    disconnectedCallback() {
    
    }
    
    createShadowDom(shadowRoot, attributes) {
        if (attributes.data.length !== 3) {
            return false;
        }

        const pointsArray = attributes.pointsArray;
        let styleNode = '';
        if (attributes.stylesheet) {
            styleNode += `<link rel="stylesheet" href="${attributes.stylesheet}">`;
        }
        styleNode += `
        <style type="text/css">
        @keyframes fadein {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
        }

        @keyframes move {
            33% {
                cx: ${pointsArray[1][0]};
                cy: ${pointsArray[1][1]};
            }
            34% {
                cx: ${pointsArray[2][0]};
                cy: ${pointsArray[2][1]};
            }
            66% {
                cx: ${pointsArray[3][0]};
                cy: ${pointsArray[3][1]};
            }
            67% {
                cx: ${pointsArray[4][0]};
                cy: ${pointsArray[4][1]};
            }
            100% {
                cx: ${pointsArray[5][0]};
                cy: ${pointsArray[5][1]};
            }
        }

        #podium-chart {
            display: flex;
            position: relative;
            width: ${attributes.width}px;
            height: ${attributes.height}px;
        }

        .podium-line {
            fill: none;
            stroke: ${attributes.strokeColor};
            stroke-width: 6;
            stroke-dasharray: ${attributes.width * 2}px;
            stroke-dashoffset: ${attributes.width * 2}px;
            animation: draw 1s forwards;
        }

        .moving-point {
            fill: yellow;
            cx: -10;
            cy: 120;
            r: 6;
            animation: move .4s linear;
            animation-delay: .7s;
        }

        .svg-line {
            position: absolute;
            z-index: 1;
            height: 100%;
        }

        .places {
            display: flex;
            align-items: flex-end;
            width: 100%;
            font-size: 30px;
            font-weight: bold;
            color: #444141;
        }

        .place {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e5e5e5;
            width: 100%;
            animation: fadein 1s;
        }

        .subject {
            position: absolute;
            white-space: break-spaces;
            text-align: center;
            font-size: 16px;
            line-height: 1.6em;
            color: #444141;
        }
        </style>`;

        shadowRoot.innerHTML = styleNode + this.getHtml(attributes);

        this.setAttribute('connected', true);
    }

    getAttributes(element) {
        const attributes = {};
        attributes.source = element.getAttribute('source');
        attributes.height = parseInt(element.getAttribute('height')) || 200;
        attributes.width = parseInt(element.getAttribute('width')) || 200;
        attributes.strokeColor = element.getAttribute('stroke-color') || '#b9b9b9';
        attributes.stylesheet = element.getAttribute('stylesheet');

        const placeWidth = Math.round(attributes.width / 3);
        const offsets = [attributes.height -  attributes.height * .4, attributes.height - attributes.height * .6, attributes.height - attributes.height * .3];
        attributes.offsets = offsets;
        attributes.pointsArray = [[0,offsets[0]], [placeWidth - 3,offsets[0]], [placeWidth,offsets[1]], [placeWidth * 2 - 3,offsets[1]], [placeWidth * 2,offsets[2]], [placeWidth * 3,offsets[2]]];
        return attributes;
    }

    sortItems(array) {
        const sortedArray = [null, null, null];
        array.forEach((item) => {
            if (item.place === 2) {
                sortedArray[0] = item;
            } else if (item.place === 1) {
                sortedArray[1] = item;
            } else {
                sortedArray[2] = item;
            }
        })
        return sortedArray;
    }

    getSubjectHeight() {

    }

    getHtml(attributes) {
        const points = attributes.pointsArray.join(' ');
        const placeOrder = [2, 1, 3];
        
        return `
        <div id="podium-chart">
            <svg height="100%" width="100%" class="svg-line">
                <polyline points="${points}" class="podium-line"></polyline>
                <circle r="6" class="moving-point"/>
            </svg>
            <div class="places">
                ${attributes.data.map((item, index) => {
                    return `
                    <div class="place" style="height: calc(100% - ${attributes.offsets[index]}px)">
                        <div class="subject" style="bottom: ${attributes.height - attributes.offsets[index] + 10}px">${item.subject}</div>
                        ${placeOrder[index]}
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    }
}
