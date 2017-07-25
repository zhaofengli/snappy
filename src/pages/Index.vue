<template>
  <v-container fluid class="full orange darken-2 text-xs-center pt-5">
    <h2 class="white--text hidden-sm-and-down">Snappy</h2>
    <v-container fluid grid-list-lg class="text-xs-left">
      <v-layout row wrap>
        <v-flex xs12 md8 offset-md2 lg4 offset-lg4>
          <unsupported-browser-warning></unsupported-browser-warning>
        </v-flex>
        <v-flex xs12 md8 offset-md2 lg4 offset-lg4>
          <v-card>
            <v-card-text>
              <v-layout row wrap class="mb-3">
                <v-flex xs12>
                  Snappy helps you browse through and interpret raw genotype files from DNA tests. In particular, it can:
                </v-flex>
              </v-layout>
              <v-layout row wrap v-for="(feature, index) in features" :key="index">
                <v-flex xs2>
                  <v-icon large>{{ feature.icon }}</v-icon>
                </v-flex>
                <v-flex xs10 class="line-mid">
                  {{ feature.text }}
                </v-flex>
              </v-layout>
              <v-layout row wrap class="mt-3">
                <v-flex xs12>
                  This is a prototype, and many things don't work. Please contribute to <a href="https://github.com/zhaofengli/snappy">our GitHub repo</a>.
                </v-flex>
              </v-layout>

              <v-btn
                primary dark fab
                absolute bottom right
                @click.native="showPicker"
                v-if="files.length === 0"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- Imported files -->
        <v-flex xs12 md8 offset-md2 lg4 offset-lg4>
          <file-card v-for="(file, index) in files" :key="index" :file="file">
          </file-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container fluid>
      <v-btn
        primary dark fab
        @click.native="showPicker"
        v-if="files.length > 0"
      >
        <v-icon>add</v-icon>
      </v-btn>

      <v-btn
        class="purple" dark fab
        @click.native="showMerger"
        v-if="files.length >= 2"
      >
        <v-icon>call_merge</v-icon>
      </v-btn>
    </v-container>

    <v-container fluid>
      <v-btn
        round
        outline
        to="acknowledgments"
        class="indigo--text"
      >
        Acknowledgments
      </v-btn>
    </v-container>

    <import-file-dialog ref="importDialog"></import-file-dialog>
    <merge-files-dialog ref="mergeDialog"></merge-files-dialog>
  </v-container>
</template>

<script>
import UnsupportedBrowserWarning from '@/components/UnsupportedBrowserWarning';
import ImportFileDialog from '@/components/ImportFileDialog';
import MergeFilesDialog from '@/components/MergeFilesDialog';
import FileCard from '@/components/FileCard';

export default {
  data() {
    return {
      features: [
        {
          icon: 'search',
          text: 'Search through SNPs',
        },
        {
          icon: 'compare_arrows',
          text: 'Cross-reference genotypes against SNPedia',
        },
        {
          icon: 'call_merge',
          text: 'Combine multiple genotype files',
        },
      ],
      sex: {},
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
  },
  components: {
    'unsupported-browser-warning': UnsupportedBrowserWarning,
    'import-file-dialog': ImportFileDialog,
    'merge-files-dialog': MergeFilesDialog,
    'file-card': FileCard,
  },
  created() {
  },
  methods: {
    showPicker() {
      this.$refs.importDialog.open();
    },
    showMerger() {
      this.$refs.mergeDialog.open();
    },
  },
};
</script>

<style lang="scss" scoped>
pre {
  background-color: #ccc;
  margin: 5px 0;
  padding: 5px;
}
.full {
  position: absolute;
  top: 48px;
  width: 100%;
  min-height: 100%;
}
.line-mid {
  line-height: 35px;
}
.ellipsis-x {
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>
