<template>
  <BaseForm @focusin.native="show = true" @focusout.native="show = false" style="position: relative;">
    <BaseInput
      @input.native="setInput($event.target.value)"
      :value="value"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      type="search"
      class="input"
    />
    <AutocompletePopup v-if="show" @select="handleSelect" :options="filteredOptions" />
  </BaseForm>
</template>

<script>
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import AutocompletePopup from "@/components/autocomplete/AutocompletePopup.vue";

export default {
  name: "Autocomplete",
  components: {
    BaseInput,
    BaseForm,
    AutocompletePopup,
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: []
    },
    filter: {
      type: Function,
      default: (options, input) => options.filter(option => option.includes(input))
    },
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    filteredOptions() {
      return this.filter(this.options, this.value);
    }
  },
  methods: {
    setInput(value) {
      if (value.length < 1) this.show = true;
      this.value = value;
      this.$emit('input', this.value);
    },
    handleSelect(value) {
      this.setInput(value);
      this.show = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
}
</style>