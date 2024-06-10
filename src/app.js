import { createActor } from 'xstate';

import Store from './services/Store.js';
import AppMachine from './machines/AppMachine.js';

// Set up app object
window.app = {};
app.store = Store;

window.addEventListener('DOMContentLoaded', () => {
  appLoad();
});

const appLoad = () => {
  window.app.system = createActor(AppMachine, {});

  app.system.start();
  app.system.send({ type: 'initialize' });
};