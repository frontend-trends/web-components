export class ScaleChart extends HTMLElement {
    static get tag() {
        return "scale-chart";
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const attributes = this.getAttributes(this);
        this.createShadowDom(shadowRoot, attributes);
    }
    
    createShadowDom(shadowRoot, attributes) {
        const squareWidth = attributes.width / 10;
        const styleNode = `
        <style type="text/css">
        #scale-chart {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: ${attributes.width}px;
            height: ${attributes.height}px;
        }

        .square {
            display: flex;
            justify-content: center;
            align-items: center;
            width: ${squareWidth - 6}px;
            height: ${squareWidth - 6}px;
            background: black;
            font-size: 18px;
            color: white;
            user-select: none;
            ${attributes.squareStyle}
        }

        @keyframes bounce {
            20% {
                transform:translateY(-10px)
            }
            50% {
                transform:translateY(0px)
            }
            100% {
                transform:translateY(0px)
            }
        }

        @keyframes magnify {
            from {
                width: ${squareWidth -6}px;
                height: ${squareWidth -6}px;
            }
            to {
                width: ${squareWidth + 4}px;
                height: ${squareWidth + 4}px;
                font-size: 1.5em
            }
        }

        ${attributes.numbers.map((number) => {
        return `.square:nth-child(${number}) {
            animation: bounce .3s linear;
            animation-delay: ${number * 0.03}s;
        }\n\n`;
          
        }).join('')}

        .square.magnify {
            animation: magnify .3s forwards;
            animation-delay: .3s;
        }
        </style>`;

        shadowRoot.innerHTML = styleNode + this.getHtml(attributes);

        const middleSquares = shadowRoot.querySelectorAll(`.square:nth-child(${attributes.choose})`);

        setTimeout(() => {
            middleSquares.forEach((square) => {
                square.classList.add('magnify');
            });
        }, 301);

        this.setAttribute('connected', true);
    }

    getAttributes(element) {
        const attributes = {};
        attributes.height = parseInt(element.getAttribute('height')) || 200;
        attributes.width = parseInt(element.getAttribute('width')) || 200;
        attributes.choose = parseInt(element.getAttribute('choose')) || 5;
        attributes.squareStyle = element.getAttribute('square-style') || '';
        let numberArray = Array.from(Array(11).keys());
        numberArray.shift();
        attributes.numbers = numberArray;

        return attributes;
    }

    getHtml(attributes) {
        let opacity = 1 - (attributes.choose * .1);
        return `
        <div id="scale-chart">
            ${attributes.numbers.map((number) => {
                if (number > attributes.choose) {
                    opacity -= 0.1;
                } else {
                    opacity += 0.1;
                }
                return `<div class="square" style="opacity: ${Math.max(opacity, 0.3).toFixed(1)}">${number}</div>`;
            }).join('')}
        </div>
        `;
    }
}
