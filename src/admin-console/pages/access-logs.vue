<template>
  <div>
    <div class="row m-5 filters">
      <h2 class="col-12 mb-4">Filtering options</h2>
      <div class="col-12 col-md-6">
        <b-form-group
          label-cols="12"
          label="Status code"
          description="Show only access logs with specific status code.">
          <b-form-input
            v-model="params.statusCode"
            v-validate="'integer'"
            name="statusCode"
            data-vv-as="status code">
          </b-form-input>
          <span class="error-span">{{ errors.first('statusCode') }}</span>
        </b-form-group>
      </div>
      <div class="col-12 col-md-6">
        <b-form-group label="HTTP method" description="Show only access logs with specific HTTP method.">
          <b-form-select v-model="params.method" :options="httpMethods"></b-form-select>
        </b-form-group>
      </div>
      <div class="col-12 col-md-6">
        <b-form-group
          label-cols="12"
          label="Request URL"
          description="Show only access logs with specific request URL.">
          <b-form-input  v-model="params.requestUrl"></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12 col-md-6">
        <b-form-group
          label-cols="12"
          label="User ID"
          description="Show only access logs with specific user ID.">
          <b-form-input  v-model="params.userId"></b-form-input>
        </b-form-group>
      </div>
    </div>
    <b-table class="requests-table pl-3 pr-3"
      :busy="loadingPage"
      :items="items"
      :fields="fields" 
      flex
      responsive
      bordered
      caption-top
      striped 
      hover
      @row-clicked="expandAdditionalInfo"
    >
    <template v-if="items.length > 0" slot="table-caption">Found {{ totalRecords }} access logs that matches your criteria.</template>
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
    <h2 v-if="!loadingPage && items.length === 0" class="text-center mt-3 mb-3"> There are no access logs found that matches your criteria. </h2>
    <ul v-if="!loadingPage && items.length > 0" class="pagination justify-content-center">
      <li class="page-item" v-bind:class="{ disabled: currentPage === 0 }">
        <a class="page-link" @click="changePage(false)"><i class="fa fa-caret-left fa-lg"></i></a>
      </li>
      <li class="page-item disabled"><span class="page-link">{{ currentPage + 1 }} / {{ totalPages }}</span></li>
      <li class="page-item" v-bind:class="{ disabled: (currentPage + 1) === totalPages }">
        <a class="page-link" @click="changePage(true)"><i class="fa fa-caret-right fa-lg"></i></a>
      </li>
    </ul>
  </div>
</template>

<script>
import { setMenuMargin } from '~/mixins/set-menu-margin';

export default {
  mixins: [ setMenuMargin ],
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
      httpMethods: [
        '',
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE',
        'CONNECT',
        'OPTIONS',
        'TRACE',
        'PATCH'
      ],
      neki: 0,
      params: {
        statusCode: '',
        method: '',
        requestUrl: '',
        userId: '',
      },
      currentPage: 0,
      loadingPage: false,
      totalPages: 0,
      totalRecords: 0,
    }
  },
  created () {
    this.$store.dispatch('ui/changeView', this.types.MenuItems.ACCESS_LOGS);
    this.getAccessLogs();
  },
  mounted () {
    this.setMenuMargin();
  },
  watch: {
    params: {
      handler() {
        this.currentPage = 0;
        this.getAccessLogs();
      },
      deep: true
    }
  },
  methods: {
    expandAdditionalInfo(row) {
      row._showDetails = !row._showDetails;
    },
    changePage(next) {
      next ? this.currentPage++ : this.currentPage--;
      this.getAccessLogs();
    },
    async getAccessLogs () {
      if (!await this.$validator.validateAll()) return;
      this.loadingPage = true;
      try {
        const res = await this.$axios.get('/analytics/requests', {
          params: {
            ...this.params.statusCode ? { statusCode: this.params.statusCode } : {},
            ...this.params.method ? { method: this.params.method } : {},
            ...this.params.requestUrl ? { requestUrl: this.params.requestUrl } : {},
            ...this.params.userId ? { userId: this.params.userId } : {},
            page: this.currentPage,
          }
        });
        this.items = res.data.data.map((d) => Object.assign(d, { _showDetails: false }));
        this.totalPages = res.data.meta.totalPages;
        this.totalRecords = res.data.meta.totalRecords;
      } catch (error) {
        // console.log(error);
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

  @include media('<560px') {
    .filters {
      margin: 0 !important;
      margin-top: 90px !important;
    }
  }

  
/* =============== pagination: ============= */

</style>
