<template>
  <v-card :class="reputeColor + ' lighten-2'">
    <v-card-title>
      <div class="headline">
        {{ value.label }}
      </div>
    </v-card-title>
    <v-card-text class="pt-0">
      <!-- Magnitude and Repute -->
      <v-chip :class="magnitudeColor">
        Magnitude:
        {{ value.m }}
      </v-chip>
      <v-chip v-if="value.r" :class="reputeColor + ' lighten-1'">
        {{ value.r }}
      </v-chip>

      <!-- Genotype/genoset summary -->
      <div class="mb-2">
        <p>
          {{ value.s }}
          <more-less-toggle v-model="genotypeFrame"></more-less-toggle>
        </p>
        <snpedia-frame
          v-if="genotypeFrame"
          class="elevation-2"
          :page="value.label"
        ></snpedia-frame>
      </div>

      <!-- SNP summary -->
      <div v-if="isSnp && options.enableExtraSnpInfo" class="elevation-2 pa-2 grey lighten-2">
        <div class="subheading">{{ value.name }}</div>
        {{ snpSummary }}
        <more-less-toggle v-model="snpFrame"></more-less-toggle>
      </div>
      <snpedia-frame
        v-if="snpFrame"
        class="elevation-2"
        :page="value.name"
      ></snpedia-frame>
    </v-card-text>
  </v-card>
</template>
<script>
import Snps from '@/snappy/Snps';

export default {
  props: ['value', 'options'],
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
    snpSummary() {
      return this.snp ? this.snp.s : 'Loading';
    },
    isSnp() {
      return !this.value.name.startsWith('gs');
    },
  },
  asyncComputed: {
    async snp() {
      try {
        const result = await Snps.get(this.value.name);
        return Object.freeze(Object.assign({
          s: 'No summary provided',
        }, result));
      } catch (e) {
        return false;
      }
    },
  },
  data() {
    return {
      genotypeFrame: false,
      snpFrame: false,
    };
  },
  watch: {
    value() {
      this.genotypeFrame = false;
      this.snpFrame = false;
    },
  },
};
</script>
