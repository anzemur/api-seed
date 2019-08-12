<template>
  <div>
    <div class="m-5">
      <div class="row">
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <PieChart v-if="devicesCountData" :data="this.devicesCountData" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 class="text-center mt-3">Number of request sent from different devices</h3>
          </div>
        </div>
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <LineChart v-if="dailyRequestCountData" :data="this.dailyRequestCountData" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 class="text-center mt-3">Number of daily sent request</h3>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <BarChart v-if="averageResponseTimes" :data="this.averageResponseTimes" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 class="text-center mt-3">Average request response times per endpoint.</h3>
          </div>
        </div>
        <div class="col-12 col-md-6 p-2">
          <div class="content p-3">
            <BarChart v-if="requestCountData" :data="this.requestCountData" :options="{ responsive: true, maintainAspectRatio: false }"/>
            <h3 class="text-center mt-3">Number of sent request per endpoint.</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';


export default {
  auth: false,
  components: {
    LineChart,
    BarChart,
    PieChart,
  },
  data () {
    return {
      devicesCountData: false,
      dailyRequestCountData: false,
      requestCountData: false,
      averageResponseTimes: false,
    }
  },
  created () {
    this.getDevicesCount();
    this.getDailyRequestCount();
    this.getRequestCount();
    this.getAverageResponseTimes();
  },
  mounted () {
    this.setNavMargin();
  },
  methods: {
    async getAverageResponseTimes() {
      try {
        const res = await this.$axios.get('/analytics/response-times');
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
        console.log(error);
      }
    },
    async getDailyRequestCount() {
      try {
        const res = await this.$axios.get('/analytics/daily-request-count');
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
        console.log(error);
      }
    },
    async getRequestCount() {
      try {
        const res = await this.$axios.get('/analytics/requests-count');
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
        console.log(error);
      }
    },
    async getDevicesCount() {
      try {
        const res = await this.$axios.get('/analytics/devices-count');
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
        console.log(error);
      }
    },
    generateRandomHexColor(){
      return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    },
    generateRandomRgbaColor() {
      return 'rgba(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ',' + Math.random().toFixed(1) + ')';
    },
    setNavMargin () {
      /* Small devices */
      if (window.screen.width < 768 || window.innerWidth < 768) {
      /* Special check for bulma mobile view switch */
      } else if ((window.screen.width >= 1024 || window.innerWidth >= 1024) && (window.screen.width < 1087 || window.innerWidth < 1087)) {
        document.getElementById('main-content').style.marginLeft = '17%'

      /* Large devices */
      } else {
        document.getElementById('main-content').style.marginLeft = '15%'
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

  .form-title {
    font-size: 1.5rem;
    color: $gray;
  }

  .group {
    border-bottom: 0.5px solid #e8e8e8;
  }
</style>
