<template>
  <a href="#" @click.prevent="toggle">{{ text }}</a>
</template>
<script>
export default {
  props: ['value'],
  computed: {
    text() {
      return this.value ? 'Less' : 'More';
    },
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    },
  },
};
</script>
