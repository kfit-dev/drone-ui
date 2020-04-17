<template>
  <Popup position="bottom" align="both">
    <div class="text" v-if="isEmpty">List is empty</div>
    <div v-for="(option, index) in options" :key="option" @mouseover="setIndex(index)" @click="select(currentIndex)" @mousedown="$event.preventDefault()">
      <slot name="option" :item="option" :active="index === currentIndex">
        <div :class="{active: index === currentIndex, option: true}">{{option}}</div>
      </slot>
    </div>
  </Popup>
</template>

<script>
import BaseInput from "@/components/forms/BaseInput";
import BaseForm from "@/components/forms/BaseForm";
import Popup from "@/components/Popup.vue";

export default {
  name: "Autocomplete",
  components: {
    BaseInput,
    BaseForm,
    Popup,
  },
  props: {
    options: { type: Array, default: () => [] }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    isEmpty() {
      return this.options.length < 1;
    },
  },
  methods: {
    stopPropagationAndPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    select(index) {
      this.$emit("select", this.options[index], index);
    },
    setIndex(index) {
      this.currentIndex = index;
    },
    handleKeyDown(e) {
      let nextIndex = this.currentIndex;

      switch (e.key) {
        case "ArrowUp":
          nextIndex -= 1;
          this.setIndex(nextIndex < 0 ? this.options.length - 1 : nextIndex);
          this.stopPropagationAndPreventDefault(e);
          break;
        case "ArrowDown":
          nextIndex += 1;
          this.setIndex(nextIndex > this.options.length - 1 ? 0 : nextIndex);
          this.stopPropagationAndPreventDefault(e);
          break;
        case "Enter":
          this.stopPropagationAndPreventDefault(e);
          break;
        default:
          break;
      }
    },
    handleKeyUp(e) {
      switch (e.key) {
        case "ArrowUp":
          this.stopPropagationAndPreventDefault(e);
          break;
        case "ArrowDown":
          this.stopPropagationAndPreventDefault(e);
          break;
        case "Enter":
          this.select(this.currentIndex);
          this.stopPropagationAndPreventDefault(e);
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variables";

.popup {
  max-height: 30vh;
  overflow-y: scroll;
}

.text,
.option {
  padding: 1rem;
}

.option {
  cursor: pointer;
  
  &.active {
    background-color: $step-selected-bg-color;
  }
}
</style>