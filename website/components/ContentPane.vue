<template>
  <div class="columns is-desktop">
    <div class="column" v-if="this.$data.leftFiltered">
      <h1 class="title is-1">{{ title }}</h1>
      <p class="content is-size-4">{{ body }}</p>
    </div>
    <!-- <div class="column">
            <figure class="image">
                <img v-lazy-load class="rounded" :src="require(`~/assets/${image}`)" />
            </figure>
        </div> -->
    <div class="column" v-if="!this.$data.leftFiltered">
      <h1 class="title is-1 extended">{{ title }}</h1>
      <p class="content is-size-4">{{ body }}</p>
    </div>
  </div>
</template>

<style>
.rounded {
  border-radius: 3%;
}
@media only screen and (min-width: 1600px) {
  .extended {
    white-space: nowrap;
  }
}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    // image: {
    //     type: String,
    //     required: true
    // },
    left: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      leftFiltered: false,
    };
  },
  created() {
    window.addEventListener("resize", this.calculateSize);
    this.calculateSize();
  },
  destroyed() {
    window.removeEventListener("resize", this.calculateSize);
  },
  methods: {
    calculateSize(_e) {
      if (window.innerWidth < 1024) {
        this.$data.leftFiltered = true;
      } else {
        this.$data.leftFiltered = this.$props.left;
      }
    },
  },
};
</script>
