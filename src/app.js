// import { createActor } from 'xstate';

import Store from './services/Store.js';
import System from './services/System.js';
// import AppMachine from './machines/AppMachine.js';

// Link web components
import HueConfig from './components/HueConfig.js';
import LightControl from './components/LightControl.js';
import LightList from './components/LightList.js';

// Set up app object
window.app = {};
app.store = Store;
app.system = System;

window.addEventListener('DOMContentLoaded', () => {
  appLoad();
});

const appLoad = () => {
  // window.app.system = createActor(AppMachine, {});
  // app.system.start();
  // app.system.send({ type: 'initialize' });
  app.system.start();
};
