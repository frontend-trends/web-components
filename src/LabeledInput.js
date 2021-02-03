export class LabeledInput extends HTMLElement {
    static get tag() {
        return "labeled-input";
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        const attributes = this.getAttributes(this);
        this.createShadowDom(shadowRoot, attributes);
    }

    createShadowDom(shadowRoot, attributes) {
        const upStyle = `
            transform: translateY(-100%);
            left: 0;
            top: -4px;
            color: black;
            ${attributes.placeholderUpStyle}`;

        const styleNode = `
        <style type="text/css">
        @keyframes move-up {
            100% { ${upStyle} }
        }

        .labeled-input {
            position: relative;
            width: ${attributes.width}px;
            height: ${attributes.height}px;
        }

        .labeled-input input {
            position: absolute;
            bottom: 0;
            border: 1px solid grey;
            padding: 7px 6px;
            background: white;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
        }

        .labeled-input .placeholder {
            position: absolute;
            left: 7px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            color: grey;
            font-size: .9em;
        }

        .labeled-input .placeholder.up {
            animation: move-up .3s forwards;
        }

        .labeled-input .placeholder.quick-up {
            ${upStyle}
        }
        </style>`;

        shadowRoot.innerHTML = styleNode + this.getHtml(attributes);

        shadowRoot.querySelectorAll('.placeholder').forEach((placeholder) => {
            shadowRoot.querySelectorAll('input').forEach((input) => {
                placeholder.addEventListener('click', () => {
                    if (!placeholder.classList.contains('up')) {
                        input.focus();
                    }
                });
                input.addEventListener('focus', () => {
                    if (!placeholder.classList.contains('quick-up')) {
                        placeholder.classList.add('up');
                    }
                });
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        placeholder.classList.remove('up');
                        placeholder.classList.remove('quick-up');
                    }
                });
            })
        })

        this.setAttribute('connected', true);
    }

    getAttributes(element) {
        const inputTypes = ['text', 'number', 'tel', 'password', 'month', 'search', 'url'];
        const attributes = {};
        attributes.height = parseInt(element.getAttribute('height')) || 40;
        attributes.width = parseInt(element.getAttribute('width')) || 300;
        attributes.placeholder = element.getAttribute('placeholder') || '';
        attributes.placeholderStyle = element.getAttribute('placeholder-style') || '';
        attributes.placeholderUpStyle = element.getAttribute('placeholder-up-style') || '';
        attributes.inputStyle = element.getAttribute('input-style') || '';
        attributes.nativeAttributes = this.getAllAttributes(element);
        if (!attributes.nativeAttributes.type || !inputTypes.includes(attributes.nativeAttributes.type)) {
            attributes.nativeAttributes.type = 'text';
        }
        delete attributes.nativeAttributes.placeholder;
        delete attributes.nativeAttributes.style;
        return attributes;
    }

    getAllAttributes(el) {
        return el.getAttributeNames().reduce((obj, name) => ({
            ...obj,
            [name]: el.getAttribute(name)
        }), {});
    }

    createAttributeString(attributes) {
        return `${Object.keys(attributes).map((key) => {
            return `${key}="${attributes[key]}" `;
        }).join('')}`;
    }

    getHtml(attributes) {
        return `
        <div class="labeled-input">
            <span class="placeholder ${attributes.nativeAttributes.value ? 'quick-up' : ''}" style="${attributes.placeholderStyle}">${attributes.placeholder}</span>
            <input ${this.createAttributeString(attributes.nativeAttributes)} style="${attributes.inputStyle}"/>
        </div>
        `;
    }
}
