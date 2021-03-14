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
        const downStyle = `
            position: absolute;
            left: 7px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            color: grey;
            font-size: .9em;
        `;

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
            border: 1px solid grey;
            padding: 7px 6px;
            background: white;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
        }

        .labeled-input .placeholder {
            ${downStyle}
        }

        .labeled-input .placeholder.up {
            animation: move-up .3s forwards;
        }

        .labeled-input .placeholder.instant-up {
            ${upStyle}
        }
        </style>`;

        shadowRoot.innerHTML = styleNode + this.getHtml(attributes);

        this.getEvents(shadowRoot.querySelector('input'), shadowRoot.querySelector('.placeholder'));

        this.setAttribute('connected', true);
    }

    getAttributes(element) {
        const inputTypes = ['text', 'number', 'tel', 'password', 'month', 'search', 'url'];
        const inputType = inputTypes.includes(this.getAttribute('type')) ? this.getAttribute('type') : 'text';
        return {
            height: parseInt(element.getAttribute('height')) || 40,
            width: parseInt(element.getAttribute('width')) || 300,
            placeholderStyle: element.getAttribute('placeholder-style'),
            placeholderUpStyle: element.getAttribute('placeholder-up-style') || '',
            placeholder: element.getAttribute('placeholder'),
            inputAttributes: {
                type: inputType,
                pattern: element.getAttribute('pattern'),
                maxlength: element.getAttribute('maxlength'),
                min: element.getAttribute('min'),
                max: element.getAttribute('max'),
                autofocus: element.getAttribute('autofocus'),
                value: element.getAttribute('value'),
                style: element.getAttribute('input-style')
            }
        }
    }

    getEvents(inputElement, placeholderElement) {
        ['change', 'focus', 'blur'].forEach(eventType => {
            inputElement.addEventListener(eventType, e => {
                this.dispatchEvent(new CustomEvent('labeled-input', {
                    bubbles: true,
                    detail: {
                        eventType,
                        value: e.currentTarget.value
                    }
                }));

                if (eventType === 'focus') {
                    if (!placeholderElement.classList.contains('instant-up')) {
                        placeholderElement.classList.add('up');
                    }
                }
    
                if (eventType === 'blur' && !inputElement.value) {
                    placeholderElement.classList.remove('up');
                    placeholderElement.classList.remove('instant-up');
                }
            });
        });

        placeholderElement.addEventListener('click', () => {
            if (!placeholderElement.classList.contains('up')) {
                inputElement.focus();
            }
        });
    }

    getHtml(attributes) {
        return `
        <div class="labeled-input">
            <span class="placeholder ${attributes.inputAttributes.value ? 'instant-up' : ''}" ${attributes.placeholderStyle ? `style="${attributes.placeholderStyle}"` : ''}>
                ${attributes.placeholder || ''}
            </span>
            <input ${Object.keys(attributes.inputAttributes).map((key) => {
                if (attributes.inputAttributes[key]) {
                    return `${key}="${attributes.inputAttributes[key]}" `;
                }
            }).join('')} />
        </div>
        `;
    }
}
