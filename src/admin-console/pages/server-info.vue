<template>
  <div>
    <div class="content mr-5 ml-5 mb-4 p-4">
      <div class="row mb-3">
        <h2 class="col-12 mb-4"> Server live information</h2>
        <div class="col-12 col-md-6">
          <b-form-group description="Total memory allocated for the process execution.">
            <span>Resident set size: </span> <span class="data-span">{{ serverInfo.rss }} MB</span>
          </b-form-group>
          <b-form-group description="Total size of the allocated heap.">
            <span>Heap total: </span> <span class="data-span">{{ serverInfo.heapTotal }} MB</span>
          </b-form-group>
          <b-form-group description="Memory used during the execution of the process.">
            <span>Heap used: </span> <span class="data-span">{{ serverInfo.heapUsed }} MB</span>
          </b-form-group>
          <b-form-group description="Memory used by C++ objects bound to JavaScript objects managed by V8.">
            <span>External memory used: </span> <span class="data-span">{{ serverInfo.external }} MB</span>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group description="Total operation system's aveilable memory.">
            <span>OS total memory: </span> <span class="data-span">{{ serverInfo.osTotalMemory }} MB</span>
          </b-form-group>
          <b-form-group description="Total operation system's free memory.">
            <span>OS free memory: </span> <span class="data-span">{{ serverInfo.osFreeMemory }} MB</span>
          </b-form-group>
          <b-form-group description="Operation system's type and release.">
            <span>OS type-release: </span> <span class="data-span">{{ serverInfo.osType }} - {{ serverInfo.osRelease }}</span>
          </b-form-group>
          <b-form-group description="Application running time in HH:MM:SS.">
            <span>Application uptime: </span> <span class="data-span">{{ serverInfo.uptime }} </span>
          </b-form-group>
        </div>
      </div>
    </div>
    <div class="content mr-5 ml-5 mb-5 p-4">
      <div class="row mb-3">
        <h2 class="col-12 mb-4">Database live information</h2>
        <div class="col-12 col-md-6">
          <b-form-group description="Name of MongoDB database.">
            <span>Database name: </span> <span class="data-span">{{ serverInfo.dbName }}</span>
          </b-form-group>
          <b-form-group description="Number of collections stored in database.">
            <span>Collections: </span> <span class="data-span">{{ serverInfo.collections }}</span>
          </b-form-group>
          <b-form-group description="Number of documents stored in database.">
            <span>Documents: </span> <span class="data-span">{{ serverInfo.dbDocs }}</span>
          </b-form-group>
          <b-form-group description="Average size of document stored in database.">
            <span>Average doc size: </span> <span class="data-span">{{ (serverInfo.avgDocSize).toFixed(3) }} B</span>
          </b-form-group>
          <b-form-group description="Total size of database consumed by documents.">
            <span>Total database size: </span> <span class="data-span">{{ bToMb(serverInfo.dbDataSize) }} MB</span>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group description="Total operation system's aveilable memory.">
            <span>OS total memory: </span> <span class="data-span">{{ bToMb(serverInfo.storageSize) }} MB</span>
          </b-form-group>
          <b-form-group description="Number of indexes stored in database.">
            <span>Indexes: </span> <span class="data-span">{{ serverInfo.indexes }} </span>
          </b-form-group>
          <b-form-group description="Total size of indexes stored in database.">
            <span>Indexes size: </span> <span class="data-span">{{ bToMb(serverInfo.indexSize) }} MB</span>
          </b-form-group>
          <b-form-group description="Total size of all disk space in use on the filesystem where database stores data.">
            <span>Used disk space: </span> <span class="data-span">{{ bToMb(serverInfo.fsUsedSize) }} MB</span>
          </b-form-group>
          <b-form-group description="Total size of all disk capacity on the filesystem where databse stores data.">
            <span>Aveilable disk space: </span> <span class="data-span">{{ bToMb(serverInfo.fsTotalSize) }} MB</span>
          </b-form-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setMenuMargin } from '~/mixins/set-menu-margin';

export default {
  mixins: [ setMenuMargin ],
  data () {
    return {
      serverInfo: {
        rss: '',
        heapTotal: '',
        heapUsed: '',
        external: '',
        osTotalMemory: '',
        osFreeMemory: '',
        uptime: '',
        osRelease: '',
        osType: '',
        dbName: '',
        collections: 0,
        dbDocs: 0,
        avgDocSize: 0,
        dbDataSize: 0,
        storageSize: 0,
        indexes: 0,
        indexSize: 0,
        fsUsedSize: 0,
        fsTotalSize: 0,
      },
      refreshInterval: null,
    }
  },
  created () {
    this.$store.dispatch('ui/changeView', this.types.MenuItems.SERVER_INFO);
  },
  mounted () {
    this.setMenuMargin();
    this.getServerInfo();
    this.refreshInterval = window.setInterval(() => {
      this.getServerInfo();
    }, 5000);
  },
  beforeDestroy() {
    window.clearInterval(this.refreshInterval);
  },
  methods: {
    async getServerInfo() {
      try {
        const res = await this.$axios.get('/analytics/server-info');

        this.serverInfo.rss = res.data.formattedRss;
        this.serverInfo.heapTotal = res.data.formattedHeapTotal;
        this.serverInfo.external = res.data.formattedExternal;
        this.serverInfo.heapUsed = res.data.formattedHeapUsed;
        this.serverInfo.osTotalMemory = res.data.formattedTotalMemory;
        this.serverInfo.osFreeMemory = res.data.formattedFreeMemory;
        this.serverInfo.uptime = res.data.formattedUptime;
        this.serverInfo.osRelease = res.data.osRelease;
        this.serverInfo.osType = res.data.osType;
        this.serverInfo.dbName = res.data.mongoStats.db;
        this.serverInfo.collections = res.data.mongoStats.collections;
        this.serverInfo.dbDocs = res.data.mongoStats.objects;
        this.serverInfo.avgDocSize = res.data.mongoStats.avgObjSize;
        this.serverInfo.dbDataSize = res.data.mongoStats.dataSize;
        this.serverInfo.storageSize = res.data.mongoStats.storageSize;
        this.serverInfo.indexes = res.data.mongoStats.indexes;
        this.serverInfo.indexSize = res.data.mongoStats.indexSize;
        this.serverInfo.fsUsedSize = res.data.mongoStats.fsUsedSize;
        this.serverInfo.fsTotalSize = res.data.mongoStats.fsTotalSize;

      } catch (error) {
        // console.log(error);
      }
    },
    bToMb(bytes) {
      return (bytes / (1024 * 1024)).toFixed(3);
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
  
  .data-span {
    font-size: 1.4rem;
    color: $primary-dark;
  }
</style>
