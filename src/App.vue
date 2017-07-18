<template>
  <v-app>
    <v-toolbar fixed class="orange darken-4" light>
      <v-toolbar-title class="white--text">Snappy</v-toolbar-title>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
    };
  },
};
</script>

<style lang="scss">
body, html {
  height: 100%;
  width: 100%;
}
</style>
