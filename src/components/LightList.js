export default class LightList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    window.addEventListener('hue-data-loaded', this.render.bind(this));
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('hue-data-loaded', this.render.bind(this));
  }

  render() {
    if (typeof app !== 'undefined') {
      const list = document.createElement('ul');
      const lights = app.store.lights;

      if (lights && Object.keys(lights).length > 0) {
        for (const key in lights) {
          if (lights.hasOwnProperty(key)) {
            const light = lights[key];

            var li = document.createElement('li');
            li.appendChild(document.createTextNode(`${key}: ${light.name}`));
            list.appendChild(li);
          }
        }
      }
      this.innerHTML = '';
      this.appendChild(list);
    } else {
      this.innerHTML = 'No lights found';
    }
  }
}

customElements.define('light-list', LightList);
