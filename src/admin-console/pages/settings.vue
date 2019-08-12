<template>
  <div>
    <b-alert class="m-5" :show="!adminConfig" variant="danger" >
      <h4 class="alert-heading">System error!</h4>
      <p> There was a problem while loading admin settings. Please try again.</p>
    </b-alert>
    <b-form @submit="saveChanges" class="content m-5 p-4">
      <div class="row mb-3 pb-3 group">
        <h2 class="col-12 mb-4"> Authenitcation settings</h2>
        <div class="col-12 col-md-6">
          <b-form-group description="We'll never share your email with anyone else.">
            <b-form-checkbox v-model="adminConfig.allowGoogleAuth" switch>
              Allow Google auth
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group description="We'll never share your email with anyone else.">
            <b-form-checkbox v-model="adminConfig.allowFacebookAuth" switch>
              Allow Facebook auth
            </b-form-checkbox>
          </b-form-group>
        </div>
      </div>

      <div class="row mb-3 group">
        <h2 class="col-12 mb-4"> Default cache settings </h2>
        <div class="col-12 col-md-6">
          <b-form-group label="Use cache per user" description="We'll never share your email with anyone else.">
            <b-form-checkbox v-model="adminConfig.cachePerUser" switch>
             
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Cache expiration"
            description="We'll never share your email with anyone else.">
            <b-form-input v-model="adminConfig.cacheExpiration"></b-form-input>
          </b-form-group>
        </div>
      </div>

      <div v-if="adminConfig.rateLimit" class="row mb-3 pb-3 group">
        <h2 class="col-12 mb-4"> Default rate limiting settings </h2>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Max points per endpoint"
            description="We'll never share your email with anyone else.">
            <b-form-input v-model="adminConfig.rateLimit.maxPoints"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Points consumed per endpoint"
            description="We'll never share your email with anyone else.">
            <b-form-input v-model="adminConfig.rateLimit.consumePoints"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Duration"
            description="We'll never share your email with anyone else.">
            <b-form-input v-model="adminConfig.rateLimit.duration"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Block duration"
            description="We'll never share your email with anyone else.">
            <b-form-input v-model="adminConfig.rateLimit.blockDuration"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label="Allow rate limiting" description="We'll never share your email with anyone else.">
            <b-form-checkbox v-model="adminConfig.rateLimit.allowRateLimit" switch>
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label="Rate limit by" description="We'll never share your email with anyone else.">
            <b-form-select v-model="adminConfig.rateLimit.limitBy" :options="rateLimitByOptions"></b-form-select>
          </b-form-group>
        </div>
      </div>

      <b-alert :show="updateState === 1" dismissible variant="success" >
        <p> Settings were successfully updated. </p>
      </b-alert>

      <b-alert :show="updateState === 2" dismissible variant="danger" >
        <p> There was a problem while updating settings. Please try again. </p>
      </b-alert>

      <b-button type="submit" variant="primary">Save changes</b-button>
    </b-form>
  </div>
</template>

<script>

export default {
  auth: false,
  data () {
    return {
      updateState: 0,
      adminConfig: {
        cachePerUser: null,
        cacheExpiration: null,
        allowFacebookAuth : null,
        allowGoogleAuth : null,
        rateLimit: {
          limitBy: null,
          maxPoints: null,
          consumePoints: null,
          duration: null,
          blockDuration: null,
          allowRateLimit: null,
        },
      },
      rateLimitByOptions: [
        { value: 0, text: 'User ID' },
        { value: 1, text: 'IP address' },
      ],
    }
  },
  created () {
    this.getAdminConfig();
  },
  mounted () {
    this.setNavMargin();
  },
  methods: {
    async saveChanges(event) {
      event.preventDefault()
      this.updateState = 0
      try {
        await this.$axios.patch('/admin/config', this.adminConfig);
        this.updateState = 1
      } catch (error) {
        this.updateState = 2
      }
    },
    async getAdminConfig () {
      try {
        const res = await this.$axios.get('/admin/config');
        this.adminConfig = {
          cachePerUser: res.data.cachePerUser,
          cacheExpiration: res.data.cacheExpiration,
          allowFacebookAuth : res.data.allowFacebookAuth,
          allowGoogleAuth : res.data.allowGoogleAuth,
          rateLimit: {
            limitBy: res.data.rateLimit.limitBy,
            maxPoints: res.data.rateLimit.maxPoints,
            consumePoints: res.data.rateLimit.consumePoints,
            duration: res.data.rateLimit.duration,
            blockDuration: res.data.rateLimit.blockDuration,
            allowRateLimit: res.data.rateLimit.allowRateLimit,
          },
        };
      } catch (error) {
        this.adminConfig = false;
      }
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
