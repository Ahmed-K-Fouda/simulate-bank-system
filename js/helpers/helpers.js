const formattingMovementDate = function (date, locale) {
  const calcDaysPaseed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

  const daysPassed = Math.round(calcDaysPaseed(new Date(), date));

  if (daysPassed === 0) {
    return locale === "ar-EG" || locale === "ar-SA" ? "اليوم" : "Today";
  } else if (daysPassed === 1) {
    return locale === "ar-EG" || locale === "ar-SA" ? "أمس" : "Yesterday";
  } else if (daysPassed <= 7) {
    return locale === "ar-EG" || locale === "ar-SA"
      ? `منذ ${daysPassed} أيام`
      : `${daysPassed} days ago`;
  } else {
    return Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurr = function (locale, value, curr) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
  }).format(value);
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((e) => e[0])
      .join("");
  });
};
