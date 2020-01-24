<template>
   <div class="row">
    <div class="login-form">
      <a href='/'>
        <img src="~/assets/img/logo.png" class="d-block mx-auto logo mt-5 mb-4">
      </a>
      <h2 class="text-center mb-5 pl-5 pr-5">
        Welcome to API-seed admin console!
      </h2>
      <b-form @submit="performLogIn" class="content pl-5 pr-5 pb-5">
        <b-form-group>
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text icon"><i class="fa fa-user fa-sm"></i></span>
            </b-input-group-prepend>
            <b-form-input
              v-model="logInData.usernameOrEmail"
              name="usernameOrEmail"
              v-validate="'required'"
              data-vv-as="username or email"
              placeholder="Username or email">
            </b-form-input>
          </b-input-group>
          <span class="error-span">{{ errors.first('usernameOrEmail') }}</span>
        </b-form-group>
  
        <b-form-group>
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text icon"><i class="fa fa-lock fa-sm"></i></span>
            </b-input-group-prepend>
            <b-form-input
              v-model="logInData.password"
              type="password"
              name="password"
              v-validate="'required'"
              placeholder="Password"
              :ref="'password'">
            </b-form-input>
          </b-input-group>          
          <span class="error-span">{{ errors.first('password') }}</span>
        </b-form-group>

        <b-alert :show="logInError !== ''" dismissible variant="danger" >
          <p> {{ logInError }}</p>
        </b-alert>
      
        <b-button class="w-100 mt-3" type="submit" variant="primary">Log In</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>

export default {
  layout: 'no-navigation',
  data () {
    return {
      logInData: {
        usernameOrEmail: '',
        password: ''
      },
      logInError: '',
    }
  },
  methods: {
    async performLogIn(event) {
      event.preventDefault()
      this.logInError = ''
      if (!await this.$validator.validateAll()) return;

      try {
        await this.$auth.loginWith('local', {
          data: {
            usernameOrEmail: this.logInData.usernameOrEmail,
            password: this.logInData.password,
          },
        });
      } catch (error) {
        if (error.response && error.response.status && error.response.status == 401) {
          this.logInError = `Incorrect log in credentials. Please try again.`
        } else if (error.response && error.response.status && error.response.status == 403) {
          this.logInError = 'You are not authorized to log in into admin console. Please try again.'
        } else {
          this.logInError = 'There was a problem while performing log in. Please try again.'
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '~/assets/scss/styles';

  .login-form {
    a > img {
      width: 75%;
    }
    width: 22%;
    background: #fff;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    -webkit-transform: translate(-50%, -40%);
    -ms-transform: translate(-50%, -40%);
    position: absolute;
    border-radius: 5px;
    -webkit-box-shadow: 9px 11px 79px -12px rgba(135,135,135,1);
    -moz-box-shadow: 9px 11px 79px -12px rgba(135,135,135,1);
    box-shadow: 9px 11px 79px -12px rgba(135,135,135,1);
  }

  @include media('<1465px') {
    .login-form {
      width: 25%;
    }
  }

  @include media('<1300px') {
    .login-form {
      width: 40%;
    }
  }
  @include media('<1000px') {
    .login-form {
      width: 50%;
    }
  }
  @include media('<800px') {
    .login-form {
      width:65%;
    }
  }
  @include media('<560px') {
    .login-form {
      margin-top: 0;
      top: 0%;
      left: 0%;
      width: 100%;
      transform: none;
      -webkit-transform: none;
      -ms-transform: none;
      position: relative;
      height: 90vh;
      box-shadow: none;
      box-sizing: content-box;
      padding-top: 10vh !important;
      padding-bottom: 0 !important;
    }
  }

  legend.col-form-label {
    font-weight: bold !important;
  }

  .col-form-label {
    font-weight: bold !important;
  }

  .icon {
    color: $gray;
  }
</style>
