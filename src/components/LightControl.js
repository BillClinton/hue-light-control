import { convertXYToRGB } from '../services/Util.js';

export default class LightControl extends HTMLElement {
  constructor() {
    super();

    // open mode allow external access to inner dom
    this.root = this.attachShadow({ mode: 'open' });
  }

  buttonClickHandler = () => {
    const stateEvent = new CustomEvent('hue-set-on', {
      detail: {
        systemId: this.dataset.systemId,
        on: !JSON.parse(this.dataset.state).on,
      },
    });
    document.dispatchEvent(stateEvent);
  };

  pickerInputHandler = (event) => {
    const stateEvent = new CustomEvent('hue-set-color', {
      detail: {
        systemId: this.dataset.systemId,
        color: event.target.value,
      },
    });
    document.dispatchEvent(stateEvent);
  };

  pickerChangeHandler = (event) => {
    console.log('pickerChangeHandler', event.target.value);
    const stateEvent = new CustomEvent('hue-set-color', {
      detail: {
        systemId: this.dataset.systemId,
        color: event.target.value,
        update: true,
      },
    });
    document.dispatchEvent(stateEvent);
  };

  // connectedCallback() {}

  render() {
    if (this.dataset.systemId) {
      const state = JSON.parse(this.dataset.state);
      const color = convertXYToRGB(
        state.xy[0],
        state.xy[1],
        parseInt(state.bri)
      );

      // Use the name set by the user, or the Hue name
      let name = this.innerHTML;
      if (name.trim().length === 0) {
        name = this.dataset.name;
      }
      const template = document.getElementById('light-button-template');
      const content = template.content.cloneNode(true);
      this.root.innerHTML = '';
      this.root.appendChild(content);

      const button = this.root.querySelector('button');
      const picker = this.root.querySelector('input[type=color]');

      button.addEventListener('click', this.buttonClickHandler.bind(this));
      button.innerText = name + ' : ' + (state.on ? 'on' : 'off');

      picker.value = color;
      if (state.on) {
        picker.removeAttribute('disabled');
        picker.value = color;
      } else {
        picker.setAttribute('disabled', true);
        // picker.value = bg;
        picker.value = 'rgba(0, 0, 0, 0)';
      }
      picker.addEventListener('input', this.pickerInputHandler.bind(this));
      picker.addEventListener('change', this.pickerChangeHandler.bind(this));
    }
  }
}

customElements.define('light-control', LightControl);
