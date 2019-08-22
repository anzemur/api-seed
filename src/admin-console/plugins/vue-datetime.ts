import Vue from 'vue';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import { Settings } from 'luxon';

Settings.defaultLocale = 'en';
Vue.use(Datetime);
