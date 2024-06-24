import { convertXYToRGB } from '../services/Util.js';

export default class LightControl extends HTMLElement {
  constructor() {
    super();

    document.addEventListener('hue-data-loaded', async (e) => {
      console.log(this.dataset.id + ': hue-data-loaded');
      this.updateState();
    });

    this.templateString = `
    <fieldset class="wrapper">
      <button>&nbsp;</button>
      <input
        type="color"
        id="head"
        name="head"
        value="#e66465"
        class="picker"
      />
      <input type="range" min="1" max="100" />
    </fieldset>`;

    // open mode allow external access to inner dom
    this.root = this.attachShadow({ mode: 'open' });
  }

  updateState = () => {
    const data = app.store.getLightData(this.dataset.id);
    this.dataset.state = data.state;
    this.dataset.modelid = data.modelid;
    this.render();
  };

  buttonClickHandler = async () => {
    await app.store.setOnState(
      this.dataset.id,
      !JSON.parse(this.dataset.state).on
    );
  };

  rangeInputHandler = async (event) => {
    if (!this.rangeInputPaused) {
      const bri = Math.round((event.target.value * 254) / 100);
      app.store.setBrightnessState(this.dataset.id, bri);
      setTimeout(() => {
        this.rangeInputPaused = false;
      }, 300);
      this.rangeInputPaused = true;
    }
  };

  rangeChangeHandler = async (event) => {
    const bri = Math.round((event.target.value * 254) / 100);
    await app.store.setBrightnessState(this.dataset.id, bri, true);
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

  connectedCallback() {
    // document.addEventListener('hue-data-loaded', async (e) => {
    //   console.log('hue-data-loaded');
    //   console.log(app.store.getLightData(this.dataset.id));
    //   const data = app.store.getLightData(this.dataset.id);
    //   this.dataset.state = data.state;
    //   this.dataset.modelid = data.modelid;
    //   this.render();
    // });
  }

  render() {
    if (this.dataset.state) {
      const template = document.getElementById('light-button-template');
      const state = JSON.parse(this.dataset.state);
      // const state = this.dataset.state;
      const color = convertXYToRGB(
        state.xy[0],
        state.xy[1],
        parseInt(state.bri)
      );

      this.root.innerHTML = '';

      // Allow user override of the template by specifying template in html document
      if (!template) {
        this.template = this.templateString;
        this.root.innerHTML = this.template;
      } else {
        this.root.appendChild(template.content.cloneNode(true));
      }

      // Use the name set by the user, or the Hue name
      let name = this.innerHTML;
      if (name.trim().length === 0) {
        name = this.dataset.name;
      }

      const button = this.root.querySelector('button');
      const range = this.root.querySelector('input[type=range]');
      const picker = this.root.querySelector('input[type=color]');

      button.addEventListener('click', this.buttonClickHandler.bind(this));
      button.innerText = name + ' : ' + (state.on ? 'on' : 'off');

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
