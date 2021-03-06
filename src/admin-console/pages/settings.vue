<template>
  <div>
    <b-alert class="m-5" :show="!adminConfig" variant="danger" >
      <h4 class="alert-heading">System error!</h4>
      <p> There was a problem while loading admin settings. Please try again.</p>
    </b-alert>
    <b-form v-if="adminConfig" @submit="saveChanges" class="content m-5 p-4">
      <div class="row mb-3 pb-3 group">
        <h2 class="col-12 mb-4"> Authenitcation settings</h2>
        <div class="col-12 col-md-6">
          <b-form-group description="Allow users to authenticate with their Google accounts.">
            <b-form-checkbox v-model="adminConfig.allowGoogleAuth" switch>
              Allow Google auth
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group description="Allow users to authenticate with their Facebook accounts.">
            <b-form-checkbox v-model="adminConfig.allowFacebookAuth" switch>
              Allow Facebook auth
            </b-form-checkbox>
          </b-form-group>
        </div>
      </div>

      <div class="row mb-3 group">
        <h2 class="col-12 mb-4"> Default cache settings </h2>
        <div class="col-12 col-md-6">
          <b-form-group label="Use cache per user" description="Cache requests globaly or per user.">
            <b-form-checkbox v-model="adminConfig.cachePerUser" switch>
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Cache expiration (s)"
            description="Cache data default expiration value in seconds.">
            <b-form-input
              v-model="adminConfig.cacheExpiration"
              v-validate="'required|integer'"
              name="cacheExpiration"
              data-vv-as="cache expiration">
            </b-form-input>
            <span class="error-span">{{ errors.first('cacheExpiration') }}</span>
          </b-form-group>
        </div>
      </div>

      <div v-if="adminConfig.rateLimit" class="row mb-3 pb-3 group">
        <h2 class="col-12 mb-4"> Default rate limiting settings </h2>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Max points per endpoint"
            description="Maximum number of points that can be consumed over duration.">
            <b-form-input
              v-model="adminConfig.rateLimit.maxPoints"
              v-validate="'required|integer'"
              name="maxPoints"
              data-vv-as="max points">
            </b-form-input>
            <span class="error-span">{{ errors.first('maxPoints') }}</span>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Points consumed per endpoint"
            description="Default number of points consumed per endpoint.">
            <b-form-input
              v-model="adminConfig.rateLimit.consumePoints"
              v-validate="'required|integer'"
              name="consumePoints"
              data-vv-as="consume points">
            </b-form-input>
            <span class="error-span">{{ errors.first('consumePoints') }}</span>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Duration"
            description="Number of seconds before consumed points are reset.">
            <b-form-input
              v-model="adminConfig.rateLimit.duration"
              v-validate="'required|integer'"
              name="duration">
            </b-form-input>
            <span class="error-span">{{ errors.first('duration') }}</span>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group
            label-cols="12"
            label="Block duration"
            description="Number of seconds the user is blocked after consuming all of available points on endpoint.">
            <b-form-input
              v-model="adminConfig.rateLimit.blockDuration"
              v-validate="'required|integer'"
              name="blockDuration"
              data-vv-as="block duration">
            </b-form-input>
            <span class="error-span">{{ errors.first('blockDuration') }}</span>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label="Allow rate limiting" description="Disable rate limiting on all routes.">
            <b-form-checkbox v-model="adminConfig.rateLimit.allowRateLimit" switch>
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label="Rate limit by" description="Rate limit by IP address of user ID.">
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
import { setMenuMargin } from '~/mixins/set-menu-margin';

export default {
  layout: 'default',
  mixins: [ setMenuMargin ],
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
    this.$store.dispatch('ui/changeView', this.types.MenuItems.SETTINGS);
    this.getAdminConfig();
  },
  mounted () {
    this.setMenuMargin();
  },
  methods: {
    async saveChanges(event) {
      event.preventDefault()
      if (!await this.$validator.validateAll()) return;
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
