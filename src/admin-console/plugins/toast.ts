import Vue from 'vue';

Vue.mixin({
  methods: {
    createToast(variant: string, msg: string) {
      this.$bvToast.toast(msg, {
        variant: variant,
        toaster: 'b-toaster-bottom-center',
        solid: false,
        noCloseButton: true,
      });
    },
  },
} as any);
