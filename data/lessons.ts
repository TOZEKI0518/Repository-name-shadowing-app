import { dailyConversationLessons } from "./dailyConversation";
import { toeicPart3Lessons } from "./toeicPart3";
import { toeicPart4Lessons } from "./toeicPart4";

export const lessons = [
  ...dailyConversationLessons,
  ...toeicPart3Lessons,
  ...toeicPart4Lessons,
];