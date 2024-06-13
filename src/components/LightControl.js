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

  rangeInputHandler = (event) => {
    const bri = Math.round((event.target.value * 254) / 100);
    const stateEvent = new CustomEvent('hue-set-brightness', {
      detail: {
        systemId: this.dataset.systemId,
        bri: bri,
      },
    });
    document.dispatchEvent(stateEvent);
  };

  rangeChangeHandler = (event) => {
    const bri = Math.round((event.target.value * 254) / 100);
    const stateEvent = new CustomEvent('hue-set-brightness', {
      detail: {
        systemId: this.dataset.systemId,
        bri: bri,
        update: true,
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
      const range = this.root.querySelector('input[type=range]');
      const picker = this.root.querySelector('input[type=color]');

      button.addEventListener('click', this.buttonClickHandler.bind(this));
      button.innerText = name + ' : ' + (state.on ? 'on' : 'off');

      range.addEventListener('input', this.rangeInputHandler.bind(this));
      range.addEventListener('change', this.rangeChangeHandler.bind(this));
      range.value = Math.round((parseInt(state.bri) * 100) / 254);

      if (state.on) {
        picker.removeAttribute('disabled');
        range.removeAttribute('disabled');
        picker.value = color;
      } else {
        picker.setAttribute('disabled', true);
        range.setAttribute('disabled', true);
        // picker.value = bg;
        picker.value = 'rgba(0, 0, 0, 0)';
      }
      picker.addEventListener('input', this.pickerInputHandler.bind(this));
      picker.addEventListener('change', this.pickerChangeHandler.bind(this));
    }
  }
}

customElements.define('light-control', LightControl);
