<template>
  <div class="frame elevation-2">
    <v-toolbar light dense>
      <v-btn icon @click.native="reload" v-if="initialLoad && !onPage"><v-icon>home</v-icon></v-btn>
      <v-breadcrumbs divider="-">
        <v-breadcrumbs-item target="_blank" :href="fullUrl">SNPedia</v-breadcrumbs-item>
        <v-breadcrumbs-item v-if="onPage">{{ page }}</v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-progress-circular v-if="!initialLoad" indeterminate class="primary--text"></v-progress-circular>
      <v-btn icon @click.native="loadCopyrights"><v-icon>copyright</v-icon></v-btn>
    </v-toolbar>
    <iframe
      class="extframe pa-2"
      referrerpolicy="no-referrer"
      sandbox="allow-scripts allow-form"
      ref="iframe"
      :src="frameUrl"
      @load="loadEvent">
    </iframe>
  </div>
</template>
<script>
export default {
  props: ['page'],
  data() {
    return {
      initialLoad: false,
      onPage: false,
    };
  },
  computed: {
    pagecomp() {
      return encodeURIComponent(this.page);
    },
    frameUrl() {
      return `https://www.snpedia.com/index.php?title=${this.pagecomp}&action=render`;
    },
    fullUrl() {
      return `https://www.snpedia.com/index.php/${this.page}`;
    },
  },
  methods: {
    loadEvent() {
      if (!this.initialLoad) {
        this.onPage = true;
        this.initialLoad = true;
      } else {
        this.onPage = false;
      }
    },
    reload() {
      this.initialLoad = false;
      this.$refs.iframe.src = this.frameUrl;
    },
    loadCopyrights() {
      this.initialLoad = true;
      this.onPage = false;
      this.$refs.iframe.src = 'https://www.snpedia.com/index.php/SNPedia:Copyrights';
    },
  },
};
</script>
<style lang="scss" scoped>
iframe {
  width: 100%;
  min-height: 500px;
  border: none;
}

.frame {
  background-color: #fafafa;
}

.btnlink {
  text-decoration: none;
}
</style>
