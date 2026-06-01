import { dailyConversationLessons } from "./dailyConversation";
import { familyLessons } from "./family";
import { businessLessons } from "./business";
import { interviewLessons } from "./interview";
import { travelLessons } from "./travel";
import { sportsLessons } from "./sports";
import { cafeRestaurantLessons } from "./cafeRestaurant";
import { shoppingLessons } from "./shopping";
import { weatherSmallTalkLessons } from "./weatherSmallTalk";
import { phoneOnlineMeetingLessons } from "./phoneOnlineMeeting";
import { hobbiesLessons } from "./hobbies";
import { workLessons } from "./work";
import { schoolStudyLessons } from "./schoolStudy";
import { directionsLessons } from "./directions";
import { hospitalLessons } from "./hospital";

export const lessons = [
  ...dailyConversationLessons,
  ...familyLessons,
  ...businessLessons,
  ...interviewLessons,
  ...travelLessons,
  ...sportsLessons,
  ...cafeRestaurantLessons,
  ...shoppingLessons,
  ...weatherSmallTalkLessons,
  ...phoneOnlineMeetingLessons,
  ...hobbiesLessons,
  ...workLessons,
  ...schoolStudyLessons,
  ...directionsLessons,
  ...hospitalLessons,
];