<template>
  <v-app>
    <v-toolbar fixed class="orange darken-4" light>
      <v-toolbar-title class="white--text">Snappy</v-toolbar-title>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>

    <v-snackbar v-model="snackbar">
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

export default {
  name: 'app',
  data() {
    return {
      snackbar: false,
      message: '',
    };
  },
  created() {
    if (process.env.NODE_ENV === 'production') {
      OfflinePluginRuntime.install({
        onInstalled: () => {
          this.message = 'Snappy is now available offline.';
          this.snackbar = true;
        },
        onUpdateReady: () => {
          OfflinePluginRuntime.applyUpdate();
        },
        onUpdated: () => {
          this.message = 'Snappy has been updated. Refresh the page to use the new version.';
          this.snackbar = true;
        },
      });
    }

    window.addEventListener('online', () => {
      this.$store.commit('setOnlineStatus', true);
    });

    window.addEventListener('offline', () => {
      this.$store.commit('setOnlineStatus', false);
    });
  },
};
</script>

<style lang="scss">
body, html {
  height: 100%;
  width: 100%;
}
</style>
