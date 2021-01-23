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
          this.withMaxPoints(attributes, this.getMaxPoints(data));
          this.withScaling(attributes);
          this.createShadowDom(shadowRoot, attributes);
        });
      } else {
        this.withMaxPoints(attributes, this.getMaxPoints(data));
        this.withScaling(attributes);
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
        justify-content: flex-end;
        position: absolute;
        padding-left: 25px;
        bottom: -25px
      }

      .line-chart svg {
        padding-left: 25px;
        width: calc(100% - 25px);
        height: 100%;
        overflow: visible;
      }
      
      .line-chart polyline {
        stroke-width: 4;
        stroke-dasharray: ${attributes.width * 2}px;
        stroke-dashoffset: ${attributes.width * 2}px;
        animation: animation 2s forwards;
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
      return attributes;
  }

  withMaxPoints(attributes, maxPoints) {
    attributes.maxYPoints = maxPoints.maxYPoints;
    attributes.maxYPoint = Math.max(...maxPoints.maxYPoints);
    attributes.maxXPoint = Math.max(...maxPoints.maxXPoints);
    return attributes;
  }

  withScaling(attributes) {
    attributes.scalingX = parseInt((attributes.width - 25) / attributes.maxXPoint) || 1;
    attributes.scalingY = parseInt(attributes.height / attributes.maxYPoint) || 1;
    return attributes;
  }

  getMaxPoints(data) {
    let maxXPoints = [];
    let maxYPoints = [];
    data.map(a => a.graph).forEach(graph => {
      let maxY = Math.max(...graph.map(a => a[1]))
      let maxX = Math.max(...graph.map(a => a[0]))
      maxYPoints.push(maxY);
      maxXPoints.push(maxX);
    });
    return {
      maxXPoints,
      maxYPoints
    }
  }

  getHtml(attributes) {
    let polylines = '';
    let nameItems = '';
    attributes.data.forEach((item, index) => {
      nameItems += `<div class="name-item"><div class="square" style="background:${item.color}; border-color: ${item.color}"></div>${item.name}</div><br/>`;
      polylines += `<polyline fill="none" stroke="${item.color}"
        points="${item.graph.map(point => {
          return `${point[0] * attributes.scalingX},${attributes.height - (point[1] * attributes.scalingY)} `
        }).join('')}" />`
    });

    return `
      <div class="line-chart">
        <div class="y-axis">
          <div style="position: absolute; bottom: 0">0</div>
          ${attributes.maxYPoints.map(yPoint => (
            `<div style="position: absolute; bottom: ${yPoint * attributes.scalingY}px">${yPoint} ${yPoint === attributes.maxYPoint ? attributes.unitY : ''}</div>`
          )).join('')}
        </div>
        <svg>
          ${polylines}
        </svg>
        <div class="x-axis">
          <div>${attributes.maxXPoint} ${attributes.unitX}</div>
        </div>
      </div>
      <div class="legend">${nameItems}</div>
      `;
  }
}
