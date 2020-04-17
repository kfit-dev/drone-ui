<template>
  <BaseForm @focusin.native="show = true" @focusout.native="show = false" style="position: relative;">
    <BaseInput
      @input.native="setInput($event.target.value)"
      :value="input"
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
      show: false,
      input: ""
    }
  },
  computed: {
    filteredOptions() {
      return this.filter(this.options, this.input);
    }
  },
  methods: {
    setInput(value) {
      if (value.length < 1) this.show = true;
      this.input = value;
      this.$emit('input', this.input);
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