export default class HueConfig extends HTMLElement {
  constructor() {
    super();

    this.ip = this.dataset['ip'];
    this.token = this.dataset['token'];
    console.log('ip', this.ip);
  }

  connectedCallback() {
    console.log('ip', this.ip);
    this.innerHTML = '';
  }
}

customElements.define('hue-config', HueConfig);
