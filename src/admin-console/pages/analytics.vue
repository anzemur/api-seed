<template>
  <div>
    <div class="m-5 analyitcs-container">
      <div class="row date-time-pickers justify-content-center mb-3">
        <datetime type="date"
          placeholder="START DATE"
          :max-datetime="queryEndDate"
          v-model="queryStartDate"
          :title="'Select start date filter'"
          :input-class="['w-100', 'dateTimeQuery']">
        </datetime>
        <datetime type="date"
          placeholder="END DATE"
          :min-datetime="queryStartDate"
          v-model="queryEndDate"
          :title="'Select end date filter'"
          :input-class="['w-100', 'dateTimeQuery']">
        </datetime>
        <span @click="resetDateQueries()" class="reset-query" v-if="queryEndDate || queryStartDate"> <i class="pl-2 mr-2 fa fa-trash fa-xs"></i></span>
      </div>
      <div class="row">
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <div v-if="!devicesCountData" class="d-flex justify-content-center mb-3">
              <b-spinner type="grow" class="spinner" variant="info" style="width: 6rem; height: 6rem;"></b-spinner>
            </div>
            <PieChart v-if="devicesCountData" :data="this.devicesCountData" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 v-if="devicesCountData" class="text-center mt-3">Number of request sent from different devices</h3>
          </div>
        </div>
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <div v-if="!dailyRequestCountData" class="d-flex justify-content-center mb-3">
              <b-spinner type="grow" class="spinner" variant="info" style="width: 6rem; height: 6rem;"></b-spinner>
            </div>
            <LineChart v-if="dailyRequestCountData" :data="this.dailyRequestCountData" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 v-if="dailyRequestCountData" class="text-center mt-3">Number of daily sent request</h3>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <div v-if="!averageResponseTimes" class="d-flex justify-content-center mb-3">
              <b-spinner type="grow" class="spinner" variant="info" style="width: 6rem; height: 6rem;"></b-spinner>
            </div>
            <BarChart v-if="averageResponseTimes" :data="this.averageResponseTimes" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 v-if="averageResponseTimes" class="text-center mt-3">Average request response times per endpoint.</h3>
          </div>
        </div>
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <div v-if="!requestCountData" class="d-flex justify-content-center mb-3">
              <b-spinner type="grow" class="spinner" variant="info" style="width: 6rem; height: 6rem;"></b-spinner>
            </div>
            <BarChart v-if="requestCountData" :data="this.requestCountData" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 v-if="requestCountData" class="text-center mt-3">Number of sent request per endpoint.</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setMenuMargin } from '~/mixins/set-menu-margin';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import { mapGetters } from 'vuex';


export default {
  mixins: [ setMenuMargin ],
  components: {
    LineChart,
    BarChart,
    PieChart,
  },
  data () {
    return {
      queryStartDate: '',
      queryEndDate: '',
      devicesCountData: false,
      dailyRequestCountData: false,
      requestCountData: false,
      averageResponseTimes: false,
    }
  },
  created () {
    this.$store.dispatch('ui/changeView', this.types.MenuItems.ANALYTICS);
    this.getDevicesCount();
    this.getDailyRequestCount();
    this.getRequestCount();
    this.getAverageResponseTimes();
  },
  async mounted () {
    this.setMenuMargin();
  },
  watch: {
    queryStartDate: function (newVal, oldVal) {
      this.getDevicesCount();
      this.getDailyRequestCount();
      this.getRequestCount();
      this.getAverageResponseTimes();
    },
    queryEndDate: function (newVal, oldVal) {
      this.getDevicesCount();
      this.getDailyRequestCount();
      this.getRequestCount();
      this.getAverageResponseTimes();
    },
  },
  methods: {
    async getAverageResponseTimes() {
      this.averageResponseTimes = false;
      try {
        const res = await this.$axios.get('/analytics/response-times', this.getRequestConfig());
        const labels = [];
        const data = [];
        res.data.map((d) => {
          labels.push(d.requestUrl.replace('/api/v1',''));
          data.push(d.responseTime);
        })
        this.averageResponseTimes = {
          labels: labels,
          datasets: [{
            label: 'Average response time (ms)',
            backgroundColor: this.generateRandomRgbaColor(),
            pointBackgroundColor: this.generateRandomRgbaColor(),
            pointBorderColor: this.generateRandomRgbaColor(),
            data,
          }]
        };
      } catch (error) {
        this.createToast('danger', 'There was an error while getting analytics data. Please try again.');
      }
    },
    resetDateQueries() {
      this.queryStartDate = '';
      this.queryEndDate = '';
    },
    async getDailyRequestCount() {
      this.dailyRequestCountData = false;
      try {
        const res = await this.$axios.get('/analytics/daily-request-count',  this.getRequestConfig());
        const labels = [];
        const data = [];
        res.data.map((d) => {
          labels.push(d.date);
          data.push(d.count);
        })
        this.dailyRequestCountData = {
          labels: labels,
          datasets: [{
            label: 'Number of sent requests',
            backgroundColor: this.generateRandomRgbaColor(),
            pointBackgroundColor: this.generateRandomRgbaColor(),
            pointBorderColor: this.generateRandomRgbaColor(),
            data,
          }]
        };
      } catch (error) {
        this.createToast('danger', 'There was an error while getting analytics data. Please try again.');
      }
    },
    async getRequestCount() {
      this.requestCountData = false;
      try {
        const res = await this.$axios.get('/analytics/requests-count',  this.getRequestConfig());
        const labels = [];
        const data = [];
        res.data.map((d) => {
          labels.push(d.requestUrl.replace('/api/v1',''));
          data.push(d.count);
        })
        this.requestCountData = {
          labels: labels,
          datasets: [{
            label: 'Number of sent requests',
            backgroundColor: this.generateRandomRgbaColor(),
            data,
          }]
        };
      } catch (error) {
        this.createToast('danger', 'There was an error while getting analytics data. Please try again.');
      }
    },
    async getDevicesCount() {
      this.devicesCountData = false;
      try {
        const res = await this.$axios.get('/analytics/devices-count',  this.getRequestConfig());
        const labels = [];
        const backgroundColor = [];
        const data = [];
        res.data.map((d) => {
          d.clientDevice ? labels.push(`${d.clientDevice}`.toUpperCase()) : labels.push('UNKNOWN');
          backgroundColor.push(this.generateRandomRgbaColor());
          data.push(d.count);
        })
        this.devicesCountData = {
          labels: labels,
          datasets: [{
            backgroundColor,
            data,
          }]
        };
      } catch (error) {
        this.createToast('danger', 'There was an error while getting analytics data. Please try again.');
      }
    },
    getRequestConfig() {
      return {
        params: {
          startTime: this.queryStartDate || '',
          endTime: this.queryEndDate || '',
        }
      };
    },
    generateRandomHexColor(){
      return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    },
    generateRandomRgbaColor() {
      return 'rgba(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ',' + Math.random().toFixed(1) + ')';
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
    .analyitcs-container {
      margin: 0 !important;
    }
  }

  .form-title {
    font-size: 1.5rem;
    color: $gray;
  }

  .reset-query {
    background-color: white;
    border: 0.5px solid #e8e8e8;
    cursor: pointer;

    i {
      color: $gray;
    }
    
    i:hover {
      color: $primary;
    }
  }

  .group {
    border-bottom: 0.5px solid #e8e8e8;
  }
</style>
