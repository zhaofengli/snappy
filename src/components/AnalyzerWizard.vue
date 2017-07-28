<template>
  <v-stepper v-model="step" vertical>
    <!-- 1. Important information -->
    <v-stepper-step step="1" v-bind:complete="step > 1" editable>
      Important information
      <small v-if="step > 1">Click to return</small>
    </v-stepper-step>
    <v-stepper-content step="1">
      Please read the following carefully:
      <ul>
        <li v-for="(item, index) in disclaimer" :key="index" v-html="item" class="mt-1"></li>
      </ul>
      <v-btn primary @click.native="step = 2">Continue</v-btn>
      <v-btn to="/">Cancel</v-btn>
    </v-stepper-content>

    <!-- 2. Configuration -->
    <v-stepper-step step="2" v-bind:complete="step > 2">
      Configuration
    </v-stepper-step>
    <v-stepper-content step="2">
      <v-checkbox v-model="enableGenosets" label="Enable genosets"></v-checkbox>
      <v-checkbox v-model="enableExtraSnpInfo" label="Show extra SNP information"></v-checkbox>

      <v-btn primary @click.native="submit()">Generate report</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {
      step: 1,
      disclaimer: [
        '<strong>Snappy is intended for educational and research purposes only.</strong> It is provided "AS IS" without warranty of any kind. See file <a href="https://github.com/zhaofengli/snappy/blob/master/LICENSE.md">LICENSE.md</a> for details.',
        'Information provided by Snappy is based on <a href="https://www.snpedia.com/index.php/Genoset">SNPedia</a>, and authors of this software make no claim about its validity and accuracy.',
        'Snappy processes your files entirely on your computer, without transmitting genotype information to servers. However, when you click "More," your browser will connect to SNPedia to load more information on the corresponding entry. SNPedia may monitor your requests.',
        '<strong>By continuing, you accept the risk of learning that you may be at high risk of a debilitating disease.</strong>',
      ],
      enableGenosets: true,
      enableExtraSnpInfo: false,
    };
  },
  methods: {
    submit() {
      this.$emit('submit', {
        enableGenosets: this.enableGenosets,
        enableExtraSnpInfo: this.enableExtraSnpInfo,
      });
    },
  },
};
</script>
