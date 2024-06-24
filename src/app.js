import Store from './services/Store.js';

// Link web components
import HueConfig from './components/HueConfig.js';
import LightControl from './components/LightControl.js';
import LightList from './components/LightList.js';

// Set up app object
window.app = {};
app.store = Store;

window.addEventListener('DOMContentLoaded', () => {
  appLoad();
});

const appLoad = () => {
  app.store.initialize();
  app.store.load();
};
