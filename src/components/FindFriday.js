import moment from "moment";

function FindFriday(weeks = 1, unformatted = false) {
  const dayINeed = 5;
  const today = moment().isoWeekday();
  /*   console.log(
    "FindFriday today <= dayINeed unformatted",
    moment().add(weeks, "weeks").isoWeekday(dayINeed).format("DD-MM-YYYY")
  );

  console.log(
    "FindFriday else Formatted",
    moment().add(weeks, "weeks").isoWeekday(dayINeed).format("DD-MM-YYYY")
  );

  console.log(" FindFriday friday unformatted", unformatted); */
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    if (unformatted) {
      return moment()
        .add(weeks, "weeks")
        .isoWeekday(dayINeed)
        .format("DD-MM-YYYY");
    }
    return moment().isoWeekday(dayINeed).format("dddd DD/MM/YYYY");
  } else {
    // otherwise, give me *next week's* instance of that same day
    if (unformatted)
      return moment()
        .add(weeks, "weeks")
        .isoWeekday(dayINeed)
        .format("DD-MM-YYYY");
    return moment()
      .add(weeks, "weeks")
      .isoWeekday(dayINeed)
      .format("dddd DD/MM/YYYY");
  }
}

export default FindFriday;
