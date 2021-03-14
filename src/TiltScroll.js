export class TiltScroll extends HTMLElement {
    static get tag() {
        return "tilt-scroll";
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const attributes = this.getAttributes(this);
        this.createShadowDom(shadowRoot, attributes);
    }

    disconnectedCallback() {
        this.pointObserver.unobserve(this.pointBottom);
        this.tiltScrollObserver.unobserve(this.element);
    }
    
    createShadowDom(shadowRoot, attributes) {
        const styleNode = `
        <style type="text/css">
        #tilt-scroll {
            height: ${attributes.height}px;
            width: ${attributes.width}px;
        }
        .tilt-scroll-point-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 1px;
            height: 1px;
        }
        </style>`;

        shadowRoot.innerHTML = styleNode + this.getHtml(attributes);

        this.pointBottom = shadowRoot.querySelector('.tilt-scroll-point-bottom')
        this.element = shadowRoot.querySelector('#tilt-scroll');
        let options = {
            threshold: this.getThresholds(),
            rootMargin: '-10%'
        }
        if (attributes.scrollArea) {
            options.root = attributes.scrollArea;
        }

        let pointVisible = false;

        this.pointObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                pointVisible = entry.isIntersecting;
            });
        });
        this.pointObserver.observe(this.pointBottom);

        const perspective = 150;
        this.tiltScrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.transform(entry.target, this.getAngle(entry.intersectionRatio.toFixed(2), pointVisible), perspective)
                }
            });
        }, options);
        this.tiltScrollObserver.observe(this.element);
        this.setAttribute('connected', true);
    }

    transform(elem, angle, perspective) {
        elem.style.transform = `perspective(${perspective}px) rotateX(${angle}deg)`;
    }

    getAngle(intersectionRatio, pointVisible) {
        let angle = 0;
        if (intersectionRatio >= 0 && intersectionRatio <= .05) {
            angle = 4;
        } else if (intersectionRatio <= .1) {
            angle = 3.7;
        } else if (intersectionRatio <= .15) {
            angle = 2.5;
        } else if (intersectionRatio <= .2) {
            angle = 1.6;
        } else if (intersectionRatio <= .25) {
            angle = 1;
        } else if (intersectionRatio <= .3) {
            angle = .7;
        } else if (intersectionRatio <= .35) {
            angle = .5;
        } else if (intersectionRatio <= .4) {
            angle = .3;
        }
        if (pointVisible) {
            angle *= -1;
        }
        return angle;
    }

    getAttributes(element) {
        const attributes = {};
        attributes.height = parseInt(element.getAttribute('height')) || '100%';
        attributes.width = parseInt(element.getAttribute('width')) || '100%';
        attributes.styleString = element.getAttribute('styleString') || '';
        attributes.scrollArea = document.querySelector(element.getAttribute('scrollArea'));
        return attributes;
    }

    getThresholds() {
        const thresholds = [];
        let i = 0;
        while (i < .4) {
            thresholds.push(i.toFixed(2));
            i += .05;
           
        }
        return thresholds;
    }

    getHtml(attributes) {
        return `
        <div id="tilt-scroll" style="${attributes.styleString}">
            <slot></slot>
            <div class="tilt-scroll-point-bottom"></div>
        </div>
        `;
    }
}
