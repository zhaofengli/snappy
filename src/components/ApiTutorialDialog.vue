<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar class="teal" dark>
        <v-btn dark icon @click.native="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Tips & Tricks</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>
          The file is now available as global variable <code>file</code>. Open your JavaScript console to start exploring!
        </p>

        <h6>Accessing genotypes</h6>

        <p>
          <pre>file.normalizedSnps.rs601338</pre>

          This will return information on <a href="https://www.snpedia.com/index.php/rs601338">rs601338</a>. <code>normalizedSnps</code> holds genotypes flipped according to SNPs' orientations on SNPedia, while <code>snps</code> always reports genotypes based on the forward strand.
        </p>

        <h6>Interpreting genotypes</h6>
        <p>
          <pre>Genotypes.get('rs5030655', 'I-')</pre>

          If your raw data reports <code>I-</code> for <a href="https://www.snpedia.com/index.php/rs5030655">rs5030655</a>, this will return a Promise that will resolve with information on that result. In this case, Snappy automatically translates <code>I-</code> to <code>-T</code> for you.

          <pre>Genotypes.get('rs332', 'II')</pre>

          This will give you a Promise that eventually rejects, as <code>II</code> is ambiguous (see <a href="https://www.snpedia.com/index.php/rs332">rs332</a>).
        </p>

        <h6>Interpreting an entire file</h6>
        <p>
          <pre>Analyzer.analyze(file)</pre>

          This will return a Promise that will resolve with an array of objects, each containing information on a specific SNP or genoset.
        </p>

        <h6>Matching genosets</h6>

        <p>
          Snappy includes a full copy of genosets available on SNPedia.

          <pre>Genosets.gs144.match(file)</pre>

          This will tell you whether the person is male or not, by matching the file against <a href="https://www.snpedia.com/index.php/gs144">gs144</a>.
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    open() {
      this.dialog = true;
    },
  },
};
</script>
