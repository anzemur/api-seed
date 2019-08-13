import Vue from 'vue';
import { mapGetters } from 'vuex';

/**
 * Sets main content side menu margin.
 */
export const setMenuMargin = Vue.extend({
  computed: {
    ...mapGetters({
      shouldMarginBeSet: 'ui/getSideMenuOpen'
    })
  },
  methods: {
    setMenuMargin() {
      if (this.shouldMarginBeSet) {
        /* Small devices */
        if (window.screen.width < 768 || window.innerWidth < 768) {
        /* Special check for bulma mobile view switch */
        } else if ((window.screen.width >= 1024 || window.innerWidth >= 1024) && (window.screen.width < 1087 || window.innerWidth < 1087)) {
          document.getElementById('main-content').style.marginLeft = '17%';
    
        /* Large devices */
        } else {
          document.getElementById('main-content').style.marginLeft = '15%';
        }
      }
    }
  },
});
