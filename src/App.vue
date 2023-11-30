<script lang="ts" setup>
// @ts-ignore
import Comment from "@/components/Comment.vue";
import { useLocalStorage } from "@vueuse/core";
import "@/styles/tailwind.css";
import "@/styles/dark.css";
import "@/styles/index.css";
import "@halo-dev/components/dist/style.css";

const group = useLocalStorage("group", "");
const kind = useLocalStorage("kind", "");
const name = useLocalStorage("name", "");
</script>

<template>
  <div style="padding: 10px">
    <div class="mb-2 grid grid-cols-3 gap-2 rounded border p-1">
      <input
        v-model="group"
        placeholder="group"
        class="h-9 rounded border px-2 py-0.5 outline-none"
      />
      <input
        v-model="kind"
        placeholder="kind"
        class="h-9 rounded border px-2 py-0.5 outline-none"
      />
      <input
        v-model="name"
        placeholder="name"
        class="h-9 rounded border px-2 py-0.5 outline-none"
      />
    </div>

    <Comment target="posts" :target-id="1"></Comment>
  </div>
</template>
