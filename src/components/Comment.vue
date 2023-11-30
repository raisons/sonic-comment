<script lang="ts" setup>
import {
  VEmpty,
  VSpace,
  VButton,
  VPagination,
  VLoading,
} from "@halo-dev/components";
import CommentItem from "./CommentItem.vue";
import Form from "./Form.vue";
import { computed, onMounted, provide, ref, type Ref } from "vue";
import type { User } from "@halo-dev/api-client";
import { apiClient } from "@/utils/api-client";
import type { CommentVoList, commentTargets } from "@/types";
import { useLocalStorage } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    target: commentTargets;
    targetId: number;
    colorScheme?: "system" | "dark" | "light";
    emojiData: () => Promise<any>;
  }>(),
  {
    colorScheme: "light",
    emojiData: undefined,
  }
);

provide<string>("target", props.target);
provide<number>("targetId", props.targetId);
provide<string>("colorScheme", props.colorScheme);
provide<() => Promise<any>>("emojiData", props.emojiData);

const currentUser = ref<User>();

const comments = ref<CommentVoList>({
  hasContent: false,
  hasNext: false,
  hasPrevious: false,
  isEmpty: true,
  isFirst: true,
  page: 0,
  pages: 1,
  rpp: 0,
  total: 0,
  content: [],
});
const pageSize = ref(10);
const loading = ref(false);

provide<Ref<User | undefined>>("currentUser", currentUser);

const handleFetchLoggedUser = async () => {
  // currentUser.value = undefined;
  // try {
  //   const { data } = await apiClient.user.getCurrentUserDetail();
  //   currentUser.value =
  //     data.user.metadata.name === "anonymousUser" ? undefined : data.user;
  // } catch (error) {
  //   console.error("Fetch logined user failed", error);
  // }
};

const handleFetchComments = async (mute?: boolean) => {
  try {
    if (!mute) {
      loading.value = true;
    }

    apiClient.comment
      .listTopComments(props.target, props.targetId, {
        page: comments.value.page,
        size: pageSize.value,
      })
      .then((response) => {
        comments.value = response.data;
      });
  } catch (error) {
    console.error("Failed to fetch comments", error);
  } finally {
    loading.value = false;
  }
};

const handlePaginationChange = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  comments.value.page = page;
  pageSize.value = size;
  handleFetchComments();
};

onMounted(() => {
  handleFetchLoggedUser();
  handleFetchComments();
});

const onCommentCreated = () => {
  handleFetchComments();
};

const getColorScheme = computed(() => {
  if (props.colorScheme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return props.colorScheme;
});

// fetch value of allowAnonymousComments

const allowAnonymousComments = ref<boolean | undefined>(false);

provide<Ref<Boolean | undefined>>(
  "allowAnonymousComments",
  allowAnonymousComments
);

const handleFetchValueOfAllowAnonymousComments = async () => {
  // const { data } = await axios.get<GlobalInfo>(`/actuator/globalinfo`, {
  //   withCredentials: true,
  // });
  allowAnonymousComments.value = true;
};

onMounted(handleFetchValueOfAllowAnonymousComments);

// upvote

const upvotedComments = useLocalStorage<string[]>("halo.upvoted.comments", []);
const upvotedReplies = useLocalStorage<string[]>("halo.upvoted.replies", []);
provide<Ref<string[]>>("upvotedComments", upvotedComments);
provide<Ref<string[]>>("upvotedReplies", upvotedReplies);
</script>
<template>
  <div class="sonic-comment-widget" :class="getColorScheme">
    <Form @created="onCommentCreated" />
    <div class="comment-timeline mt-6">
      <div class="flex items-center">
        <div class="flex flex-auto items-center gap-1">
          <span class="text-sm font-medium text-gray-900 dark:text-slate-50">
            {{ comments?.total || 0 }} 条评论
          </span>
          <span v-if="false" class="font-bold">·</span>
          <span v-if="false" class="text-sm text-gray-800">20 条回复</span>
        </div>
        <div></div>
      </div>

      <div
        class="mt-4 flex flex-col divide-y divide-gray-100 dark:divide-slate-700"
      >
        <VLoading v-if="loading" class="dark:text-slate-100" />
        <Transition v-else-if="!comments.content.length" appear name="fade">
          <VEmpty title="暂无评论" message="你可以尝试点击刷新或者添加新评论">
            <template #actions>
              <VSpace>
                <VButton type="default" @click="handleFetchComments">
                  刷新
                </VButton>
              </VSpace>
            </template>
          </VEmpty>
        </Transition>
        <TransitionGroup v-else appear name="fade" tag="div">
          <CommentItem
            v-for="(comment, index) in comments.content"
            :key="index"
            :comment="comment"
            :target="props.target"
            :target-id="props.targetId"
            @reload="handleFetchComments(true)"
          ></CommentItem>
        </TransitionGroup>
      </div>
    </div>
    <div
      v-if="comments.hasPrevious || comments.hasNext"
      class="my-4 sm:flex sm:items-center sm:justify-center"
    >
      <VPagination
        :page="comments.value.page"
        :size="pageSize.value"
        :total="comments.value.total"
        :size-options="[10, 20, 50, 100]"
        class="bg-transparent"
        @change="handlePaginationChange"
      />
    </div>
  </div>
</template>
