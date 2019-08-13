<template>
  <div id="side-nav" class="side-nav">
    <ul class="mt-4">
      <li @click="changeView(types.MenuItems.SETTINGS)" v-bind:class="{ active: menuItem === types.MenuItems.SETTINGS }">
        <nuxt-link to="/settings" class="pl-3 pb-2 pt-2">
          <i class="mr-2 side-nav-ic fa fa-cogs fa-xs"></i>
          <span>Settings</span>
        </nuxt-link>
      </li>
      <li @click="changeView(types.MenuItems.ANALYTICS)" v-bind:class="{ active: menuItem === types.MenuItems.ANALYTICS }">
        <nuxt-link to="/analytics" class="pl-3 pb-2 pt-2">
          <i class="mr-2 side-nav-ic fa fa-chart-bar fa-xs"></i>
          <span>Analytics</span>
        </nuxt-link>
      </li>
      <li @click="changeView(types.MenuItems.ACCESS_LOGS)" v-bind:class="{ active: menuItem === types.MenuItems.ACCESS_LOGS }">
        <nuxt-link to="/" class="pl-3 pb-2 pt-2">
          <i class="mr-2 side-nav-ic fa fa-info-circle fa-xs"></i>
          <span>Access logs</span>
        </nuxt-link>
      </li>
      <li @click="changeView(types.MenuItems.USERS)" v-bind:class="{ active: menuItem === types.MenuItems.USERS }">
        <nuxt-link to="/" class="pl-3 pb-2 pt-2">
          <i class="mr-2 side-nav-ic fa fa-user fa-xs"></i>
          <span>Users</span>
        </nuxt-link>
      </li>
      <li @click="logOut()" class="side-nav-profile">
        <nuxt-link to="#" class="pl-3 pb-2 pt-2">
          <i class="mr-2 side-nav-ic fa fa-sign-out-alt fa-xs"></i>
          <span>Log Out</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { MenuItems } from '../types';
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      mainContentMarginLeft: 0,
      mobile: false,
      isActive: true,
      menuItem: MenuItems.SETTINGS,
      user: {},
    }
  },
  computed: {
    ...mapGetters({
      showMenu: 'ui/getSideMenuOpen',
      currentView: 'ui/getCurrentView'
    })
  },
  watch: {
    showMenu: function (show) {
      show ? this.openNav() : this.closeNav()
    },
    currentView: function (view) {
      this.menuItem = view
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.windowResized)
      this.windowResized()
    })
    if (this.showMenu) this.openNav()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.windowResized)
  },
  methods: {
    windowResized (event) {
      if (this.showMenu && (window.screen.width < 1070 || window.innerWidth < 1070)) {
        this.$store.dispatch('ui/toggleSideMenu')
      }
    },
    openNav () {
      this.mainContentMarginLeft = window.getComputedStyle(document.getElementById('main-content'))['margin-left'] || 0

      /* Small devices */
      if (window.screen.width < 768 || window.innerWidth < 768) {
        this.mobile = true
        document.getElementById('side-nav').style.width = '100%'

      /* Medium devices */
      } else if ((window.screen.width >= 768 || window.innerWidth >= 768) && (window.screen.width < 1024 || window.innerWidth < 1024)) {
        this.mobile = true
        document.getElementById('side-nav').style.width = '25%'

      /* Special check for bulma mobile view switch */
      } else if ((window.screen.width >= 1024 || window.innerWidth >= 1024) && (window.screen.width < 1087 || window.innerWidth < 1087)) {
        this.mobile = true
        document.getElementById('side-nav').style.width = '17%'
        document.getElementById('main-content').style.marginLeft = '17%'

      /* Large devices */
      } else {
        document.getElementById('side-nav').style.width = '15%'
        document.getElementById('main-content').style.marginLeft = '15%'
        this.mobile = false
      }
    },
    closeNav () {
      document.getElementById('side-nav').style.width = '0'
      document.getElementById('main-content').style.marginLeft = this.mainContentMarginLeft
    },
    async changeView (view) {
      this.menuItem = view;
      await this.$store.dispatch('ui/changeView', view)
      if (this.mobile) {
        this.$store.dispatch('ui/toggleSideMenu')
      }
    },
    async logOut() {
      await this.$auth.logout();
      this.$router.push('/login');
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~/assets/scss/styles';

  .side-nav {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: #484848;
    overflow-x: hidden;
    padding-top: 3.5rem;
    transition: 0.5s;
  }

  .side-nav-ic {
  }

  .side-nav a {
    text-decoration: none;
    font-size: 1.3rem;
    color: #a4a4a4;
    display: block;
    transition: 0.3s;
    white-space: nowrap;
    overflow: hidden;
    &:active {
      color: #f1f1f1;
      .side-nav-ic {
        color: $primary;
      }
    }

    &:hover {
      color: #f1f1f1;
      .side-nav-ic {
        color: $primary;
      }
    }
  }

  .side-nav-ic{
    color: #8a8888;
  }

  .side-nav-profile {
    position: absolute;
    bottom: 0;
  }

  li.active {
    background-color: #3a3a3a;
  }

  input{
    display:none;
  }

  li > input > label {
    margin: 0;
  }

  li > input:checked > label{
    background: $white;
  }

  ul {
    list-style-type: none;
    padding-left: 0px;
  }


.fa-2x {
  vertical-align: middle;
}
</style>
