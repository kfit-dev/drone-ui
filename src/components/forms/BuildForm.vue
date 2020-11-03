<template>
  <BaseForm @submit.native.prevent="handleSubmit" class="form">
    <header>
      <h2 class="title">
        Create a Build
      </h2>
    </header>
    <div class="control-group">
      <div class="control-label">
        <label>Branch</label>
      </div>
      <div class="controls">
        <BaseInput v-if="shouldRenderTextInput" v-model="branch"></BaseInput>
        <Autocomplete v-else v-model="branch"  :options="branches"/>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label">Parameters</label>
      <div class="controls param-list-container">
        <ul class="param-list">
          <li v-for="(val, key) in params" :key="key" class="param-list-item">
            <code class="param-list-key" :title="`${key}=${val}`">{{key}}={{val}}</code>
            <Button @click.native.prevent="(e) => handleRmParam(key, e)" type="button" theme="danger" size="m" outline borderless>Remove</Button>
          </li>
        </ul>
        <BaseForm @submit.native.prevent="handleAddParam" class="param-list-form">
          <BaseInput
            v-model="paramInput.key"
            name="key"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="Key"
            type="text"
          />
          <BaseInput
            v-model="paramInput.value"
            name="value"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="Value"
            type="text"
          />
          <Button type="submit" size="l" theme="primary" outline borderless>Add</Button>
        </BaseForm>
      </div>
    </div>
    <div>
      {{params }}
    </div>
    <div class="control-actions">
      <Button type="button" size="l" theme="primary" :loading="submitting" @click.native="handleSubmit">Create</Button>
      <Button type="button" size="l" outline @click.native="handleCancel">Cancel</Button>
      <div class="error-message" v-if="errors.length">{{ errors.join("\n") }}</div>
    </div>
  </BaseForm>
</template>

<script>
import Button from "@/components/buttons/Button.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import Autocomplete from "@/components/autocomplete/Autocomplete.vue";

export default {
  name: "BuildForm",
  components: {
    Button,
    BaseInput,
    BaseForm,
    Autocomplete
  },
  props: ['passed'],
  data() {
    return {
      submitting: false,
      errors: [],
      branch: "",
      params: {},
      paramInput: {
        key: "",
        value: ""
      },
    }
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    branches() {
      return this.$store.state.branches[this.slug]
        && this.$store.state.branches[this.slug].data
        && Object.keys(this.$store.state.branches[this.slug].data)
        || [];
    },
    shouldRenderTextInput(){
      console.log(Object.keys(this.passed).length !== 0)
      return Object.keys(this.passed).length !== 0
    }
  },
  methods: {
    async handleSubmit(e) {
      this.errors = [];

      const { namespace, name } = this.$route.params;

      const inputs = {
        branch: this.branch,
        params: this.params
      };
      const build = {
        namespace,
        name,
        ...inputs
      };
      console.log(build)
      if (!this.branch.length) this.errors.push("Branch is required");
      if (!this.errors.length) {
        this.submitting = true;
        try {
          const data = await this.$store.dispatch("createBuild", build);
          this.$emit("submit", inputs);

          if (data.build) {
            this.$router.push(`/${namespace}/${name}/${data.build.number}`);
          } else {
            this.$store.dispatch("showNotification", { message: "No build triggered" });
          }
        } catch (err) {
          this.errors.push(err);
        } finally {
          this.submitting = false;
        }
      }
    },
    handleCancel(e) {
      this.$emit("cancel");
    },
    handleAddParam(e) {
      if (this.paramInput.key == "" || this.paramInput.value == "") return;

      this.params[this.paramInput.key] = this.paramInput.value;
      this.paramInput.key = "";
      this.paramInput.value = "";
    },
    handleRmParam(key) {
      this.$delete(this.params, key);
    },
    logProps(){
    console.log(this.passed)      
    }
  },
  created(){
    const GH_BUILD_BRANCH_KEY = "gh_build_branch_name"
    let passedKeys = Object.keys(this.passed)
    if (passedKeys.length != 0) {
      for (let key of passedKeys){
        if (key === GH_BUILD_BRANCH_KEY) {
          this.branch = this.passed[GH_BUILD_BRANCH_KEY]
        }else {
          this.params[key] = this.passed[key]
        }
      }
      console.log("ther'es a passed params")
    }else{
      console.log("there's no params")
    }
  },
  mounted() {
    this.$store.dispatch("fetchBranches", this.$store.state.route.params);
  }
};
</script>

<style scoped lang="scss">
.text {
  padding: 1rem;
}

.form {
  // max-width: 464px;

  .base-input {
    width: 100%;
  }

  header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgba(30,55,90,.05);
    padding: 0 15px;
    display: flex;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .control-group,
  .control-actions,
  .header {
    padding: 11px 15px;
  }

  .control-group {
    align-items: baseline;

    .control-label {
      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 0;
      text-align: right;
      margin-right: 1.5rem;
    }

    .controls {
      flex-basis: 0;
      flex-grow: 5;
      flex-shrink: 1;
    }
  }

  .control-actions {
    .button + .button {
      margin-left: 1rem;
    }
  }

  .param-list {
    &:not(:empty) {
      margin-bottom: 16px;
    }
  }

  .param-list-container, .param-list-key {
    min-width: 0;
  }

  .param-list-key {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .param-list-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 2px 0;

    code {
      font-family: monospace;
    }
  }

  .param-list-form {
    display: flex;
    flex-wrap: nowrap;

    * + * {
      margin-left: 0.5rem;
    }

    * {
      flex-shrink: 1;
    }
  }
}
</style>