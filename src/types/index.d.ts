import { CommentStatus } from "@halo-dev/content-api/lib/types";

export interface GlobalInfo {
  externalUrl: string;
  timeZone: string;
  locale: string;
  allowComments: boolean;
  allowAnonymousComments: boolean;
  allowRegistration: boolean;
}

import {
  Page,
  CommentWithHasChildren,
  BaseComment,
} from "@/content-api";

declare type commentTargets = "posts" | "sheets" | "journals";

type BaseCommentVo = BaseComment

interface CommentVo extends CommentWithHasChildren {
  avatar: string;
}

type CommentVoList = Page<CommentVo>;

interface ReplyVo extends BaseCommentVo{
  avatar: string;
}

