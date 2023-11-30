<script lang="ts" setup>
import { VTag, VAvatar } from "@halo-dev/components";
import Form from "./Form.vue";
import type { ReplyVo, commentTargets } from "@/types";
import { computed, inject, ref, type Ref } from "vue";
import { formatDatetime, timeAgo } from "@/utils/date";
import MdiReply from "~icons/mdi/reply";
import MdiCardsHeart from "~icons/mdi/cards-heart";
import MdiCardsHeartOutline from "~icons/mdi/cards-heart-outline";

import { apiClient } from "@/utils/api-client";

const props = defineProps<{
  reply: ReplyVo;
  replies: ReplyVo[];
}>();

const emit = defineEmits<{
  (event: "reload"): void;
}>();

const target = inject<commentTargets>("target");
const targetId = inject<number>("targetId")
const showForm = ref(false);

const website = computed(() => {
  if (!props.reply) {
    return "";
  }
  props.reply.authorUrl;
});

const quoteReply = computed(() => {
  const replyName = props.reply.author;

  if (!replyName) {
    return undefined;
  }

  return props.replies.find((reply) => reply.author === replyName);
});

const onReplyCreated = () => {
  emit("reload");
  showForm.value = false;
};

// Show hovered reply
const hoveredReply = inject<Ref<ReplyVo | undefined>>("hoveredReply");

const handleShowQuoteReply = (show: boolean) => {
  if (hoveredReply) {
    hoveredReply.value = show ? quoteReply.value : undefined;
  }
};

const isHoveredReply = computed(() => {
  return hoveredReply?.value?.id === props.reply.id;
});

// upvote
const upvotedReplies = inject<Ref<number[]>>("upvotedReplies", ref([]));
const handleUpvote = async () => {
  if (!props.reply) {
    return;
  }

  if (upvotedReplies.value.includes(props.reply.id)) {
    return;
  }

  await apiClient.comment.upvote(props.reply.id);

  upvotedReplies.value.push(props.reply.id);

  emit("reload");
};
</script>

<template>
  <div
    :id="`reply-${reply.id}`"
    class="reply-item py-3"
    :class="{ 'animate-breath': isHoveredReply }"
  >
    <div class="flex flex-row gap-3">
      <div class="reply-avatar">
        <VAvatar
          :src="reply?.avatar"
          :alt="reply?.author"
          size="sm"
          circle
        />
      </div>
      <div class="flex-1">
        <div class="reply-informations flex items-center">
          <div class="flex flex-auto items-center gap-3">
            <div class="text-sm font-medium dark:text-slate-50">
              <a
                v-if="website"
                class="hover:text-gray-600 dark:hover:text-slate-300"
                :href="website"
                target="_blank"
              >
                {{ reply?.author }}
              </a>
              <span v-else>
                {{ reply?.author }}
              </span>
            </div>
            <span
              class="text-xs text-gray-500 dark:text-slate-400"
              :title="formatDatetime(reply.createTime)"
            >
              {{ timeAgo(reply.createTime) }}
            </span>
            <VTag
              v-if="false"
              rounded
              class="dark:!border-slate-600 dark:!bg-slate-700 dark:!text-slate-50"
            >
              Author
            </VTag>
          </div>
        </div>
        <div class="reply-content mt-2">
          <pre
            class="whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-slate-200"
          ><a
              v-if="quoteReply"
              class="mr-1 inline-flex flex-row items-center gap-1 rounded bg-gray-200 py-0.5 px-1 text-xs font-medium text-gray-600 hover:text-blue-500 hover:underline dark:bg-slate-700 dark:text-slate-200 dark:hover:text-slate-100"
              :href="`#reply-${quoteReply.id}`"
              @mouseenter="handleShowQuoteReply(true)"
              @mouseleave="handleShowQuoteReply(false)"
            >
              <MdiReply />
              <span>{{ quoteReply.author }}</span>
            </a><br v-if="quoteReply" />{{
              reply.content
            }}</pre>
        </div>
        <div class="reply-actions mt-2 flex flex-auto items-center gap-1">
          <div
            class="inline-flex cursor-pointer select-none items-center gap-1 text-xs text-gray-600 hover:text-gray-900 dark:text-slate-500 dark:hover:text-slate-400"
            @click="handleUpvote()"
          >
            <MdiCardsHeartOutline
              v-if="!upvotedReplies.includes(reply?.id as number)"
              class="h-3.5 w-3.5 hover:text-red-600 hover:dark:text-red-400"
            />
            <MdiCardsHeart
              v-else
              class="h-3.5 w-3.5 text-red-600 dark:text-red-400"
            />
            <span>
              {{ reply.likes }}
            </span>
          </div>
          <span class="text-gray-600">·</span>
          <span
            class="cursor-pointer select-none text-xs text-gray-600 hover:text-gray-900 dark:text-slate-500 dark:hover:text-slate-400"
            @click="showForm = !showForm"
          >
            回复
          </span>
        </div>
        <Form
          v-if="showForm"
          class="mt-2"
          :comment="reply"
          @created="onReplyCreated"
        />
      </div>
    </div>
  </div>
</template>
