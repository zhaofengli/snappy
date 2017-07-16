<template>
  <v-card v-if="unsupported">
    <v-card-title class="headline">
      Unsupported browser
    </v-card-title>
    <v-card-text>
      Your browser lacks features for Snappy to run optimally, and you may encounter high memory usage and poor performance. It's recommended that you use Chrome/Chromium, Firefox or Edge.
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      unsupported: false,
    };
  },
  created() {
    const byeIE = new RegExp('Trident|(MS)?IE', 'g');
    this.unsupported = byeIE.exec(navigator.userAgent) ||
                       typeof Proxy === 'undefined';
  },
};
</script>
