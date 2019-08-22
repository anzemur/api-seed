/**
 * Nuxt.js admin console app config. Uncomment this config and it will be used if you want to run/build admin console app independently.
 */
export default {
  server: {
    port: 3030
  },
  /**
   * Application mode.
   */
  mode: 'universal',
  /**
   * Base application routing.
   */
  router: {
    middleware: [
      'auth',
      'redirect'
    ]
  },
  /**
   * Authentication middleware.
   */
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
    },
    resetOnError: true,
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/admin',
            method: 'post',
            propertyName: 'authToken',
          },
          logout: false,
          user: false,
        },
      },
    },
  },
  /*
  ** Headers of the page.
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,  initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { 
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.4.1/css/all.css',
        integrity: 'sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz',
        crossorigin: 'anonymous'
      }
    ]
  },
  /*
  ** Customize the progress-bar color.
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS.
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App.
  */
  plugins: [
    { src: '~plugins/vee-validate', ssr: true },
    { src: '~plugins/types', ssr: true },
    { src: '~plugins/toast', ssr: true },
    { src: '~plugins/vue-datetime', ssr: true },
  ],
  /*
  ** Nuxt.js modules.
  */
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],
  /*
  ** Axios module configuration.
  */
  axios: {
    baseURL: 'http://localhost:3000/api/v1/',
  },
};
