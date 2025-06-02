import helperFuncs from "../utils/dummyApi/helperFuncs.js";
import { EventType } from "./Event.js";
import { EventCategoryEnum, EventSizeEnum } from "./Event.js";

function makeRandomEventsArr(numOfEvents: number): EventType[] {
  const results: EventType[] = [];
  while (results.length < numOfEvents) {
    const [budgetMin, budgetMax] = helperFuncs.getRandomBudgetMinMax();
    const [startTime, endTime] = helperFuncs.getRandomDates();
    const locData = helperFuncs.getRandLocData();
    const eventType = helperFuncs.getRandomEventType();
    const eventSize = helperFuncs.getRandomEventSize();

    const dummyEvent: EventType = {
      id: helperFuncs.getRandomId(100),
      externalId: helperFuncs.getRandomId(1000).toString(),
      originId: helperFuncs.getRandomId(1000).toString(),
      originUrl: "https://www.codechrysalis.io",
      name: helperFuncs.getRandomName(),
      description: helperFuncs.getRandomDescription(),
      teaserText: helperFuncs.getRandomDescription().slice(0, 50) + "...",
      teaserMedia: "",
      teaserFreeform: "",
      placeLattitude: locData.lat,
      placeLongitude: locData.long,
      placeFreeform: locData.city,
      budgetMin: budgetMin,
      budgetMax: budgetMax,
      budgetCurrency: "YEN",
      budgetFreeform: "",
      datetimeStart: startTime,
      datetimeEnd: endTime,
      datetimeFreeform: "",
      category: EventCategoryEnum[eventType],
      categoryFreeform: "",
      size: EventSizeEnum[eventSize],
      sizeFreeform: "",
    };

    results.push(dummyEvent);
  }

  return results;
}

export default makeRandomEventsArr;
