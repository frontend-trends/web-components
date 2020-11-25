export class LineChart extends HTMLElement {
  static get tag() {
      return "line-chart";
  }

  connectedCallback() {
      const attributes = this.getAttributes(this);
      const shadowRoot = this.attachShadow({mode: 'open'});

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
      .line-chart {
        width: ${attributes.width}px;
        height: ${attributes.height}px;
        position: relative;
      }

      .y-axis {
        height: 100%;
        line-height: 0;
        position: absolute;
        width: 100%;
      }

      .x-axis {
        width: calc(100% - 25px);
        display: flex;
        justify-content: space-between;
        position: absolute;
        padding-left: 25px;
        bottom: -25px
      }

      .line-chart svg {
        padding-left: 25px;
        width: calc(100% - 25px);
        height: 100%;
      }
      
      .line-chart polyline {
        stroke-width: 4;
        stroke-dasharray: ${attributes.width * 2}px;
        stroke-dashoffset: ${attributes.width * 2}px;
        animation: animation 1s forwards;
      }
      
      @keyframes animation {
        to {
          stroke-dashoffset: 0;
        }
      }

      .legend {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        margin-top: 40px;
        user-select: none;
      }

      .name-item {
          display: inline-flex;
          align-items: center;
          margin-bottom: 5px;
          margin-left: 8px;
          white-space: nowrap;
          padding: 0 3px;
      }

      .square {
        border: 1px solid;
        width: 10px;
        height: 10px;
        margin-right: 10px;
      }
      </style>`;

      shadowRoot.innerHTML = styleNode + this.getHtml(attributes);
      this.setAttribute('connected', true);
  }

  getAttributes(element) {
      const attributes = {};
      attributes.data = JSON.parse(element.getAttribute('data'));
      attributes.source = element.getAttribute('source');
      attributes.height = parseInt(element.getAttribute('height')) || 200;
      attributes.width = parseInt(element.getAttribute('width')) || 200;
      attributes.unitX = element.getAttribute('unit-x') || 'unit';
      attributes.unitY = element.getAttribute('unit-y') || 'unit';
      attributes.scaling = parseInt(element.getAttribute('scaling')) || 1;
      return attributes;
  }

  getHtml(attributes) {
    let polylines = '';
    let nameItems = '';
    let maxX = 0;
    let maxValues = [];
    attributes.data.forEach((item, index) => {
      let maxY = 0;
      nameItems += `<div class="name-item"><div class="square" style="background:${item.color}; border-color: ${item.color}"></div>${item.name}</div><br/>`;
      polylines += `<polyline fill="none" stroke="${item.color}"
        points="${item.graph.map(point => {
          if (point[1] > maxY) {
            maxY = point[1];
          }
          if (point[0] > maxX) {
            maxX = point[0];
          }
          return `${point[0] * attributes.scaling},${attributes.height - (point[1] * attributes.scaling)} `
        }).join('')}" />`

        maxValues.push(maxY);
    });

    return `
      <div class="line-chart">
        <div class="y-axis">
          <div style="position:absolute; top: 0">${attributes.unitY}</div>
          ${maxValues.map(maxValue => (
            `<div style="position:absolute; bottom:${maxValue * attributes.scaling}px">${maxValue}</div>`
          )).join('')}
        </div>
        <svg>
          ${polylines}
        </svg>
        <div class="x-axis">
          <div>0</div>
          <div>${maxX} ${attributes.unitX}</div>
        </div>
      </div>
      <div class="legend">${nameItems}</div>
      `;
  }
}
