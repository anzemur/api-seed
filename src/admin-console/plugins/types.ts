import Vue from 'vue';
import { MenuItems } from '../types';

Vue.mixin({
  data() {
    return {
      types: {
        MenuItems,
      },
    };
  },
});
