<template>
  <div>
    <b-table v-if="items" striped hover :items="items"></b-table>
  </div>
</template>

<script>
import { setMenuMargin } from '~/mixins/set-menu-margin';

export default {
  mixins: [ setMenuMargin ],
  auth: false,
  data () {
    return {
      items: false,
      params: {
        projection: true,
      }
    }
  },
  created () {
    this.getAccessLogs();
  },
  mounted () {
    this.setMenuMargin();
  },
  methods: {
    async getAccessLogs () {
      const params = {

      }

      try {
        const res = await this.$axios.get('/analytics/requests', { params: this.params });
        console.log(res.data.data);
        this.items = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~/assets/scss/styles';

  .main {
    background-color: white;
  }

  .content {
    background-color: white;
    border: 0.5px solid #e8e8e8;
  }

  @include media('<560px') {
    .content {
      margin: 0 !important;
    }
  }

  .form-title {
    font-size: 1.5rem;
    color: $gray;
  }

  .group {
    border-bottom: 0.5px solid #e8e8e8;
  }
</style>
