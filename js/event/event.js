const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const movementRow = document.querySelector(".movements__row");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const logOutTimer = function () {
  const tick = function () {
    let min = Math.trunc(time / 60)
      .toString()
      .padStart(2, 0);
    let seconed = Math.trunc(time % 60)
      .toString()
      .padStart(2, 0);
    labelTimer.textContent = `${min}:${seconed}`;
    time--;

    if (time === -1) {
      clearInterval(timer);
      containerApp.style.opacity = "0";
      labelWelcome.textContent = "Login to get started";
    }
  };
  let time = 50;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  const trimmedUsername = inputLoginUsername.value.trim();
  currentAccount = accounts.find((name) => name.username === trimmedUsername);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = "1";
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    update(currentAccount);

    const option = {
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      weekday: "short",
      second: "numeric",
    };
    let loc = navigator.language;

    loc = currentAccount.locale;

    function updateDateTime() {
      const now = new Date();
      labelDate.textContent = new Intl.DateTimeFormat(loc, option).format(now);
    }

    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    if (timer) clearInterval(timer);
    timer = logOutTimer();
    updateDateTime();

    intervalId = setInterval(updateDateTime, 1000);

    inputLoginPin.blur();
    inputLoginUsername.blur();

    inputLoginPin.value = inputLoginUsername.value = "";
  } else if (currentAccount?.username !== inputLoginUsername.value) {
    alert("User not found");
  } else if (currentAccount?.pin !== Number(inputLoginPin.value)) {
    alert("Wrong Password");
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = parseFloat(inputTransferAmount.value);
  const reciver = accounts.find(
    (name) => name.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    reciver &&
    reciver?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    reciver.movements.push(amount);

    // add current date

    currentAccount.movementsDates.push(new Date().toISOString());
    reciver.movementsDates.push(new Date().toISOString());

    // update UI

    update(currentAccount);

    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferTo.blur();
    inputTransferAmount.blur();
  } else if (
    reciver &&
    reciver.username === currentAccount.username &&
    !isNaN(parseFloat(inputTransferAmount.value))
  ) {
    return alert("You can't transfer to yourself");
  } else {
    alert("Incorrect data!");
  }
  clearInterval(timer);
  timer = logOutTimer();
});

let hasActiveLoan = false; // Flag to track if the user has an active loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  // Wrap the code inside setTimeout to delay execution
  setTimeout(function () {
    if (
      !hasActiveLoan &&
      loanAmount > 0 &&
      currentAccount.movements.some((val) => val >= loanAmount * 0.1)
    ) {
      currentAccount.movements.push(loanAmount);

      inputLoanAmount.blur();
      // add current date

      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      update(currentAccount);
      hasActiveLoan = true; // Set the flag to true after granting the loan
      alert("Loan request successful");
    } else if (hasActiveLoan) {
      alert(
        "You already have an active loan. Please repay it before requesting a new one."
      );
    } else {
      const maxLoan =
        currentAccount.movements.reduce(
          (acc, curr) => (acc > curr ? acc : curr),
          0
        ) * 10;
      alert(`We are sorry, but you can only loan up to ${maxLoan} pounds.`);
    }
    inputLoanAmount.value = "";
  }, 2000); // Delay execution for 2 seconds (2000 milliseconds)
  clearInterval(timer);
  timer = logOutTimer();
});

// delete account handler
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  const pinClose = Number(inputClosePin.value);

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === pinClose
  ) {
    const findIndex = accounts.findIndex(
      (i) => currentAccount.username === i.username
    );
    accounts.splice(findIndex, 1);
    containerApp.style.opacity = "0";
    labelWelcome.innerHTML = "<p>Login to get started</p>";
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  AddAccountToMovementRow(currentAccount, !sorted);
  sorted = !sorted;
});
