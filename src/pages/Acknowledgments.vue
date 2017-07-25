<template>
  <v-container fluid>
    <h2>Acknowledgments</h2>
    <p>
      This project wouldn't be possible without:
      <ul>
        <li v-for="(item, index) in thanks" :key="index">
          <a :href="item.link">{{ item.text }}</a>
        </li>
      </ul>
    </p>

    <h3>Licensing</h3>
    <p>
      Snappy depends on certain third-party data:
      <ul>
        <li v-for="(item, index) in licenses" :key="index">
          <a :href="item.link">{{ item.text }}</a>
          (<a :href="item.licenselink">{{ item.license }}</a>)
        </li>
      </ul>
    </p>
    <p>
      Detailed information may be found at
      <a :href="tplink" v-html="tptext"></a>.
    </p>

    <h3>Get involved</h3>
    <p>
      Snappy needs your help. Get involved at
      <a :href="ctlink" v-html="cttext"></a>.
    </p>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      thanks: [
        { text: 'SNPedia', link: 'https://www.snpedia.com/' },
        { text: 'dna2json', link: 'https://github.com/genomejs/dna2json' },
        { text: 'gql', link: 'https://github.com/genomejs/gql' },
        { text: 'Vue.js', link: 'https://vuejs.org/' },
        { text: 'PEG.js', link: 'https://pegjs.org/' },
      ],
      licenses: [
        {
          text: 'SNPedia',
          license: 'Creative Commons Attribution-NonCommercial-ShareAlike 3.0 United States',
          link: 'https://www.snpedia.com/',
          licenselink: 'https://creativecommons.org/licenses/by-nc-sa/3.0/us/',
        },
      ],
      tptext: '<code>THIRDPARTY.md</code>',
      tplink: 'https://github.com/zhaofengli/snappy/blob/master/THIRDPARTY.md',
      cttext: 'GitHub',
      ctlink: 'https://github.com/zhaofengli/snappy',
    };
  },
};
</script>
