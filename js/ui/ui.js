const AddAccountToMovementRow = function (accs, sort = false) {
  const movs = sort
    ? accs.movements.slice().sort((a, b) => a - b)
    : accs.movements;

  containerMovements.innerHTML = "";
  movs.forEach(function (move, i) {
    const checkDepOrWith = move > 0 ? "deposit" : "withdrawal";
    const hoverColor = move > 0 ? "#01de89" : "#ff585f";

    const date = new Date(accs.movementsDates[i]);

    const displayDate = formattingMovementDate(date, accs.locale);

    const formNum = formatCurr(accs.locale, move, accs.currency);

    const htmlMoveRow = `<div class="movements__row">
<div class="movements__type movements__type--${checkDepOrWith}">${
      i + 1
    } ${checkDepOrWith}</div>
<div class="movements__date">${displayDate}</div>
<div class="movements__value">${formNum}</div>
</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", htmlMoveRow);
    const row = containerMovements.firstChild;
    row.addEventListener("mouseenter", function () {
      row.style.backgroundColor = hoverColor;
    });
    row.addEventListener("mouseleave", function () {
      row.style.backgroundColor = "";
    });
  });
};

const calcBalance = function (accs) {
  accs.balance = accs.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formatCurr(
    accs.locale,
    accs.balance,
    accs.currency
  );
};

const calcDisplaySummary = function (accs) {
  // calc incoms
  const incoms = accs.movements
    .filter((move) => move > 0)
    .reduce((acc, move) => acc + move);
  labelSumIn.textContent = formatCurr(accs.locale, incoms, accs.currency);
  // calc outcom
  const outcoms = accs.movements
    .filter((move) => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = formatCurr(
    accs.locale,
    Math.abs(outcoms),
    accs.currency
  );
  // calc INTEREST
  const interest = accs.movements
    .filter((move) => move > 0)
    .map((deposite) => (deposite * accs.interestRate) / 100)
    .filter((val) => val >= 1)
    .reduce((acc, move) => acc + move);
  labelSumInterest.textContent = formatCurr(
    accs.locale,
    interest,
    accs.currency
  );
};

const update = function (accs) {
  AddAccountToMovementRow(accs);
  calcBalance(accs);
  calcDisplaySummary(accs);
};
