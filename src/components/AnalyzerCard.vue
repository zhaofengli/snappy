<template>
  <v-card :class="reputeColor + ' lighten-2'">
    <v-card-title>
      <div class="headline">
        {{ value.name }}
      </div>
    </v-card-title>
    <v-card-text class="pt-0">
      <div>
        <!-- Magnitude and Repute -->
        <v-chip :class="magnitudeColor">
          Magnitude:
          {{ value.m }}
        </v-chip>
        <v-chip v-if="value.r" :class="reputeColor + ' lighten-1'">
          {{ value.r }}
        </v-chip>
      </div>
      <p>
        <!-- Summary -->
        {{ value.s }}
        <more-less-toggle v-model="snpediaFrame"></more-less-toggle>
      </p>
      <snpedia-frame
        v-if="snpediaFrame"
        class="elevation-2"
        :page="value.name"
      ></snpedia-frame>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ['value'],
  computed: {
    snpedia() {
      return page => `https://www.snpedia.com/index.php/${page}`;
    },
    reputeColor() {
      switch (this.value.r) {
        case 'Bad': return 'red';
        case 'Good': return 'green';
        default: return '';
      }
    },
    magnitudeColor() {
      if (this.value.m === 0) {
        return '';
      } else if (this.value.m <= 1) {
        return 'blue-grey lighten-2';
      } else if (this.value.m < 3) {
        return 'indigo lighten-3';
      } else if (this.value.m < 5) {
        return 'lime';
      } else if (this.value.m < 8) {
        return 'deep-orange lighten-1';
      }
      return 'pink lighten-1';
    },
  },
  data() {
    return {
      snpediaFrame: false,
    };
  },
  methods: {
    toggleSnpedia() {
      this.snpediaFrame = !this.snpediaFrame;
    },
  },
  watch: {
    value() {
      this.snpediaFrame = false;
    },
  },
};
</script>
