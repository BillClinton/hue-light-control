// import { convertRGBToHex } from '../services/Util.js';

// import {
//   assign,
//   createMachine,
//   interpret,
//   sendTo,
// } from 'https://cdn.skypack.dev/xstate@5.13.1';

export default class LightButton extends HTMLElement {
  #machine;
  #name;
  #service = null;

  constructor() {
    super();

    // open mode allow external access to inner dom
    this.root = this.attachShadow({ mode: 'open' });
  }

  setMachine(machine) {
    this.#machine = machine;
    // this.#machine.subscribe((state) => {
    //   console.log('state', state);
    // });
  }

  getMachine() {
    return this.#machine;
  }

  buttonClickHandler = (event) => {
    app.system.send({
      type: 'set.on.state',
      systemId: this.dataset.systemId,
      on: !JSON.parse(this.dataset.state).on,
    });
  };

  //   button.addEventListener('click', (event) => {
  //     setOnState(this.getAttribute('lightID'), !state.on);
  //   });

  pickerInputHandler = (event) => {
    app.system.send({
      type: 'set.color.state',
      systemId: this.dataset.systemId,
      color: event.target.value,
    });
  };

  //   picker.addEventListener('input', (event) => {
  //     setColorState(
  //       this.getAttribute('lightID'),
  //       event.target.value,
  //       this.getAttribute('lightModelID'),
  //       false
  //     );
  //   });

  //   picker.addEventListener('change', (event) => {
  //     setColorState(
  //       this.getAttribute('lightID'),
  //       event.target.value,
  //       this.getAttribute('lightModelID')
  //     );
  //   });

  connectedCallback() {
    // const name = this.innerHTML;
    // const template = document.getElementById('light-button-template');
    // const content = template.content.cloneNode(true);
    // this.root.appendChild(content);
    // const button = this.root.querySelector('button');
    // button.innerHTML = name;
    // button.addEventListener('click', this.clickHandler.bind(this));
    // this.render();
  }

  render() {
    console.log('render');
    this.root.innerHTML = '';
    if (this.dataset.systemId) {
      const state = JSON.parse(this.dataset.state);
      console.log('state', state);

      // Use the name set by the user, or the Hue name
      let name = this.innerHTML;
      if (name.trim().length === 0) {
        name = this.dataset.name;
      }
      const template = document.getElementById('light-button-template');
      const content = template.content.cloneNode(true);
      this.root.appendChild(content);

      // const wrapper = this.root.querySelector('.wrapper');
      const button = this.root.querySelector('button');
      const picker = this.root.querySelector('input[type=color]');
      // console.log(wrapper);
      // console.log(
      //   window.getComputedStyle(wrapper).getPropertyValue('background-color')
      // );
      // const bg = convertRGBToHex(
      //   window.getComputedStyle(wrapper).getPropertyValue('background-color')
      // );

      button.addEventListener('click', this.buttonClickHandler.bind(this));
      button.innerText = name + ' : ' + (state.on ? 'on' : 'off');

      picker.value = this.dataset.color;
      if (state.on) {
        picker.removeAttribute('disabled');
        picker.value = this.dataset.color;
      } else {
        picker.setAttribute('disabled', true);
        // picker.value = bg;
        picker.value = 'rgba(0, 0, 0, 0)';
      }
      picker.addEventListener('input', this.pickerInputHandler.bind(this));
    }
  }
}

customElements.define('light-button', LightButton);
