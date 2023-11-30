<script lang="ts" setup>
import { VButton, VLoading, VDialog } from "@halo-dev/components";
import MdiStickerEmoji from "~icons/mdi/sticker-emoji";
import MdiSendCircleOutline from "~icons/mdi/send-circle-outline";
// @ts-ignore
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { inject, ref } from "vue";
import { apiClient } from "@/utils/api-client";
import { validateEmail, validateUrl } from "@/utils/validators"
import { useLocalStorage } from "@vueuse/core";
import { onClickOutside } from "@vueuse/core";
import autosize from "autosize";
import { isMac } from "@/utils/device";
import type { commentTargets, BaseCommentVo } from "@/types"
import type { BaseCommentParam } from "@/content-api";

interface CustomAccount {
  author: string;
  email: string;
  authorUrl: string;
}

const props = withDefaults(
  defineProps<{
    comment?: BaseCommentVo;
  }>(),
  {
    comment: undefined,
  }
);

const emit = defineEmits<{
  (event: "created"): void;
}>();

const target = inject<commentTargets>("target");
const targetId = inject<number>("targetId");
const emojiData = inject<() => Promise<any>>("emojiData", () =>
  Promise.resolve()
);

const raw = ref("");
const saving = ref(false);

const vAutosize = {
  mounted: (el: HTMLElement) => {
    autosize(el);
  },
};

const customAccount = useLocalStorage<CustomAccount>(
  "sonic-comment-custom-account",
  {
    author: "",
    email: "",
    authorUrl: "",
  }
);

const auditingDialogVisible = ref<Boolean>(false);
const handleAuditingDialogClose = () => {
  auditingDialogVisible.value = false;
  emit("created");
}

const handleSubmit = async () => {
  if (!target || !targetId) {
    console.error("Please provide target and targetId");
    return;
  }

  if (!validateEmail(customAccount.value.email)) {
    alert("email格式不正确!");
    return;
  }

  if (customAccount.value.authorUrl && !validateUrl(customAccount.value.authorUrl)) {
    alert("网站必须以http://或https://开头");
    return
  }

  try {
    saving.value = true;

    let req_params:BaseCommentParam = {
      author: customAccount.value.author,
      email: customAccount.value.email,
      authorUrl: customAccount.value.authorUrl,
      content: raw.value,
      postId: targetId,
    }

    if (props.comment) {
      req_params.parentId = props.comment.id;
    }

    const { data } = await apiClient.comment.create(target, req_params);
    if (data.status === "AUDITING") {
      auditingDialogVisible.value = true;
    } else {
      emit("created");
    }

  } catch (error) {
    console.error("Failed to create comment", error);
  } finally {
    raw.value = "";
    saving.value = false;
  }
};

// Emoji picker
const contentInputRef = ref();
const emojiPickerVisible = ref(false);
const emojiPickerRef = ref(null);
const emojiIndex = ref();
const emojiLoading = ref(false);

async function handleOpenEmojiPicker() {
  if (emojiPickerVisible.value) {
    emojiPickerVisible.value = false;
    return;
  }

  if (emojiIndex.value) {
    emojiPickerVisible.value = true;
    return;
  }

  emojiLoading.value = true;

  if (!emojiData) {
    alert("未设置emoji库");
    emojiLoading.value = false;
    return;
  }

  const data = await emojiData();

  if (!data) {
    emojiLoading.value = false;
    return;
  }

  emojiIndex.value = new EmojiIndex(data);
  emojiLoading.value = false;

  emojiPickerVisible.value = true;
}

function onEmojiSelect(emoji: { native: string }) {
  raw.value += emoji.native;
  contentInputRef.value.focus();
}

onClickOutside(emojiPickerRef, () => {
  emojiPickerVisible.value = false;
});

// KeyBoard shortcuts
function onKeydown(e: KeyboardEvent) {
  if (!raw.value) {
    return;
  }

  const isEnter = e.key === "Enter";
  const isShortcut = isMac ? e.metaKey : e.ctrlKey;
  if (isShortcut && isEnter) {
    handleSubmit();
    e.preventDefault();
  }
}
</script>

<template>
  <div class="comment-form flex gap-4" @keydown="onKeydown">
    <div class="flex flex-1 flex-col gap-y-4">
      <textarea
        ref="contentInputRef"
        v-model="raw"
        v-autosize
        required
        rows="4"
        class="rounded-base block w-full resize-y appearance-none bg-white px-3 py-2 text-sm text-black antialiased outline-0 ring-1 ring-gray-300 dark:bg-slate-700 dark:text-slate-50 dark:ring-slate-600"
        placeholder="编写评论"
      ></textarea>

      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-4">
        <input
          v-model="customAccount.author"
          class="rounded-base h-9 px-2 py-0.5 text-sm outline-none ring-1 ring-gray-300 dark:bg-slate-700 dark:text-slate-50 dark:ring-slate-600"
          type="text"
          placeholder="昵称"
        />
        <input
          v-model="customAccount.email"
          class="rounded-base h-9 px-2 py-0.5 text-sm outline-none ring-1 ring-gray-300 dark:bg-slate-700 dark:text-slate-50 dark:ring-slate-600"
          type="email"
          placeholder="电子邮件"
        />
        <input
          v-model="customAccount.authorUrl"
          class="rounded-base h-9 px-2 py-0.5 text-sm outline-none ring-1 ring-gray-300 dark:bg-slate-700 dark:text-slate-50 dark:ring-slate-600"
          type="url"
          placeholder="网站(http://、https://)"
        />
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
          </div>
          <div class="flex flex-row items-center gap-3">
            <div ref="emojiPickerRef" class="relative">
              <VLoading v-if="emojiLoading" class="!p-0" />
              <MdiStickerEmoji
                  v-else
                  class="h-5 w-5 cursor-pointer text-gray-500 transition-all hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
                  @click="handleOpenEmojiPicker"
              />
              <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="translate-y-1 opacity-0"
              >
                <div
                    v-show="emojiPickerVisible"
                    class="absolute right-0 z-10 mt-3 transform px-4 sm:px-0"
                >
                  <Picker
                      v-if="emojiIndex"
                      :data="emojiIndex"
                      :native="true"
                      @select="onEmojiSelect"
                  />
                </div>
              </transition>
            </div>
            <VButton
                :disabled="!raw"
                type="secondary"
                :loading="saving"
                @click="handleSubmit"
            >
              <template #icon>
                <MdiSendCircleOutline class="h-full w-full" />
              </template>
              提交评论
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-container">
      <VDialog
          type="info"
          title="评论成功"
          description="请等待博主审核，审核通过后显示。"
          confirm-type="secondary"
          :show-cancel="false"
          :visible="auditingDialogVisible"
          @close="handleAuditingDialogClose"
      ></VDialog>
    </div>
  </div>
</template>
