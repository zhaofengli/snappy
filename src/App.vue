<template>
  <v-app>
    <v-navigation-drawer
      persistent
      light
      :mini-variant.sync="mini"
      v-model="drawer"
    >
      <v-list class="pa-0">
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="orange darken-4" light>
      <v-toolbar-side-icon class="white--text" @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
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
      drawer: false,
      mini: false,
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
