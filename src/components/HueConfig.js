export default class HueConfig extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = '';
  }
}

customElements.define('hue-config', HueConfig);
