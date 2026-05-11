import { dailyConversationLessons } from "./dailyConversation";
import { familyLessons } from "./family";
import { businessLessons } from "./business";
import { toeicLessons } from "./toeic";
import { travelLessons } from "./travel";
import { sportsLessons } from "./sports";
import { hotelAirportLessons } from "./hotelAirport";
import { cafeRestaurantLessons } from "./cafeRestaurant";
import { shoppingLessons } from "./shopping";
import { weatherSmallTalkLessons } from "./weatherSmallTalk";
import { phoneOnlineMeetingLessons } from "./phoneOnlineMeeting";
import { hobbiesLessons } from "./hobbies";
import { workLessons } from "./work";
import { schoolStudyLessons } from "./schoolStudy";
import { directionsLessons } from "./directions";

export const lessons = [
  ...dailyConversationLessons,
  ...familyLessons,
  ...businessLessons,
  ...toeicLessons,
  ...travelLessons,
  ...sportsLessons,
  ...hotelAirportLessons,
  ...cafeRestaurantLessons,
  ...shoppingLessons,
  ...weatherSmallTalkLessons,
  ...phoneOnlineMeetingLessons,
  ...hobbiesLessons,
  ...workLessons,
  ...schoolStudyLessons,
  ...directionsLessons,
];