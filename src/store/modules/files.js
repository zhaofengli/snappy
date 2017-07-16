export default {
  state: {
    files: [],
    selected: null,
  },
  mutations: {
    addFile(state, file) {
      state.files.push(file);
    },
    removeFile(state, id) {
      state.files = state.files.filter(file => file.id !== id);
      if (state.selected === id) {
        state.selected = null;
      }
    },
    selectFile(state, id) {
      state.selected = id;
    },
  },
  getters: {
    countFiles(state) {
      return state.files.length;
    },
    getFile: state => id => state.files.find(file => file.id === id),
    getSelectedFile: (state, getters) => getters.getFile(state.selected),
  },
};
