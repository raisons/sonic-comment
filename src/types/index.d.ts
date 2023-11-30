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

type CommentVo = CommentWithHasChildren

type CommentVoList = Page<CommentVo>;

type ReplyVo = BaseCommentVo
