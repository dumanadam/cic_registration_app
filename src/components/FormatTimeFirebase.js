import moment from "moment";

function FormatTimeFirebase(timeToFormat, shiftHours = 1) {
  let time = moment(timeToFormat, "HH:mm")
    .add(shiftHours, "hours")
    .format("h:mm A");
  console.log("FormatTimeFirebase", time);
  return time;
}

export default FormatTimeFirebase;
