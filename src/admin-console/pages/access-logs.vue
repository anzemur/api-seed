<template>
  <div class="neki">
    <b-table class="requests-table"
      :busy="loadingPage"
      :items="items"
      :fields="fields" 
      flex
      responsive
      striped 
      hover
      @row-clicked="expandAdditionalInfo"
    >
    <div slot="table-busy" class="text-center my-2">
      <b-spinner class="align-middle"></b-spinner>
      <strong>Loading...</strong>
    </div>
    <template slot="row-details" slot-scope="row">
      <b-card>
        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>ID:</b></b-col>
          <b-col sm="2">{{ row.item._id }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Request ID:</b></b-col>
          <b-col sm="2">{{ row.item.requestId }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Created at:</b></b-col>
          <b-col sm="2">{{ row.item.createdAt }}</b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>Base Url:</b></b-col>
          <b-col sm="2">{{ row.item.requestUrl }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Full Url:</b></b-col>
          <b-col sm="2">{{ row.item.fullRequestUrl }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Response time:</b></b-col>
          <b-col sm="2">{{ row.item.responseTime }} ms</b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>Method:</b></b-col>
          <b-col sm="2">{{ row.item.method }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Status code:</b></b-col>
          <b-col sm="2">{{ row.item.statusCode }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Status message:</b></b-col>
          <b-col sm="2">{{ row.item.statusMessage }}</b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>Host:</b></b-col>
          <b-col sm="2">{{ row.item.host }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>HTTP version:</b></b-col>
          <b-col sm="2">{{ row.item.httpVersion }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Protocol:</b></b-col>
          <b-col sm="2">{{ row.item.protocol }}</b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>User ID:</b></b-col>
          <b-col sm="2">{{ row.item.userId || 'undefined'}}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Client device:</b></b-col>
          <b-col sm="2">{{ row.item.clientDevice }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>IP:</b></b-col>
          <b-col sm="2">{{ row.item.ip }}</b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>User agent:</b></b-col>
          <b-col sm="10">{{ row.item.userAgent }}</b-col>
        </b-row>
      </b-card>
    </template>
  </b-table>
  </div>
</template>

<script>
import { setMenuMargin } from '~/mixins/set-menu-margin';

export default {
  mixins: [ setMenuMargin ],
  auth: false,
  data () {
    return {
      fields: [
        { key: '_id', sortable: true },
        { key: 'fullRequestUrl', sortable: true },
        { key: 'method', sortable: true },
        { key: 'statusCode', sortable: true },
        { key: 'createdAt', sortable: true },
      ],
      items: [],
      params: {
      },
      loadingPage: false,
    }
  },
  created () {
    this.$store.dispatch('ui/changeView', this.types.MenuItems.ACCESS_LOGS);
    this.getAccessLogs();
  },
  mounted () {
    this.setMenuMargin();
  },
  methods: {
    expandAdditionalInfo(row) {
      row._showDetails = !row._showDetails;
    },
    async getAccessLogs () {
      this.loadingPage = true;
      try {
        const res = await this.$axios.get('/analytics/requests', { params: this.params });
        this.items = res.data.data.map((d) => Object.assign(d, { _showDetails: false }));
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingPage = false;
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

  .requests-table {
    cursor: pointer;
  }
</style>
