import type { App } from 'vue';
import InputBox from './InputBox.vue'

declare module 'vue' {
  export interface GlobalComponents {
    InputBox: typeof import('./InputBox.vue').default;
  }
}

const componentPlugin = {
  install(app: App) {
    app.component('InputBox', InputBox)
  }
}

export {
  componentPlugin
};
