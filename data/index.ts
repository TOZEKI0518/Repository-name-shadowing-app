import { dailyConversationLessons } from "./dailyConversation";
import { familyLessons } from "./family";
import { businessLessons } from "./business";
import { interviewLessons } from "./interview";
import { travelLessons } from "./travel";
import { loveLessons } from "./love";
import { sportsLessons } from "./sports";
import { cafeRestaurantLessons } from "./cafeRestaurant";
import { shoppingLessons } from "./shopping";
import { weatherSmallTalkLessons } from "./weatherSmallTalk";
import { phoneOnlineMeetingLessons } from "./phoneOnlineMeeting";
import { hobbiesLessons } from "./hobbies";
import { schoolStudyLessons } from "./schoolStudy";
import { directionsLessons } from "./directions";
import { hospitalLessons } from "./hospital";

export const lessons = [
  ...dailyConversationLessons,    // 1-30
  ...familyLessons,               // 31-60
  ...businessLessons,             // 61-90
  ...interviewLessons,            // 91-120
  ...travelLessons,               // 121-150
  ...cafeRestaurantLessons,       // 151-180
  ...shoppingLessons,             // 181-210
  ...directionsLessons,           // 211-240
  ...phoneOnlineMeetingLessons,   // 241-270
  ...weatherSmallTalkLessons,     // 271-300
  ...sportsLessons,               // 301-330
  ...hobbiesLessons,              // 331-360
  ...hospitalLessons,             // 361-390
  ...schoolStudyLessons,          // 391-420
  ...loveLessons,                 // 421-450
];