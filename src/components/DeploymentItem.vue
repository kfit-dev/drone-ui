<template>
  <Card class="deploy-item" slim :hoverable="hoverable">
    <div class="deploy">{{ target }}</div>
    <div class="build-description">
      <span>{{ build.sender }}</span>
      <span> {{ action }} </span>
      <a class="build-number" target="_blank" :href="hrefParent">#{{ build.parent }}</a>
      <span class="commit-message" v-if="build.message" :title="build.message"> — {{ build.message }}</span>
    </div>
    <Status :status="status"/>
  </Card>
</template>

<script>
import Status from "@/components/Status.vue";
import Card from "@/components/Card.vue";
import BuildDescription from "@/components/BuildDescription";
import RepoItemLabel from "@/components/RepoItemLabel";
export default {
  name: "DeploymentItem",
  props: {
    hoverable: { type: Boolean, default: false },
    target: { type: String, required: true },
    status: { type: String, required: true },
    build: { type: Object, required: true },
    linkRepo: Object
  },
  components: {
    Card,
    BuildDescription,
    RepoItemLabel,
    Status
  },
  computed: {
    action() {
      const { event } = this.build;
      if (event === "pull_request") return "opened pull request";
      if (event === "tag") return "created tag";
      if (event === "promote") return "promoted to build";
      if (event === "rollback") return "reverted to build";
      return "pushed";
    },
    hrefParent() {
      return this.build && this.linkRepo && `/${this.linkRepo.slug}/${this.build.parent}`
    },
    shrinkedBuild() {
      return { ...this.build };
    }
  }
};
</script>

<style lang="scss">
@import "../assets/styles/mixins";
.deploy-item {
  display: flex;
  align-items: center;
  @include tablet {
    flex-wrap: wrap;
  }

  .to {
    display: none !important;
  }

  .content {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    @include tablet {
      flex-wrap: wrap;
    }
  }

  .build-description {
    flex-grow: 1;
    margin-right: 10px;
    @include tablet {
      order: 2;
      margin-top: 10px;
      width: 100%;
      margin-right: 0;
    }
  }

  .status {
    flex-shrink: 0;
  }
}

.deploy {
  max-width: 170px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  background: $color-primary-bg;
  border-radius: 2px;
  font-weight: 600;
  color: $color-primary;
  margin-right: 15px;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @include tablet {
    margin-right: auto;
  }
}

.build-description {
  color: rgba(25, 45, 70, 0.6);
  line-height: 20px;
}
.commit-message {
  font-style: italic;
}

.build-number {
  background-color: rgba($color-primary, 0.07);
  color: $color-primary;
  padding: 0 4px;
  border-radius: 2px;
}
</style>