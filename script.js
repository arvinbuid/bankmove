'use strict';

// Data
const account1 = {
  owner: 'Mary Jane Watson',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2017-11-18T21:31:17.178Z',
    '2018-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-08-27T14:11:59.604Z',
    '2024-09-02T17:01:17.194Z',
    '2024-09-03T23:36:17.929Z',
    '2024-09-05T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Peter Parker',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-09-01T14:43:26.374Z',
    '2024-09-03T18:49:59.371Z',
    '2024-09-05T12:01:20.894Z',
  ],
  currency: 'PHP',
  locale: 'tl-PH',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// FUNCTIONS

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago `;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${year}/${month}/${day}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// REUSABLE INTERNATIONALIZATION FOR CURRENCY
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

// Display deposit & withdrawals
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // sort movements if true
  const movsSort = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // loop movements
  movsSort.map((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // internationalization date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // internationalization currency
    const displayMovementCurrency = formatCurrency(
      mov,
      acc.locale,
      acc.currency
    );

    const html = `
     <div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__date">${displayDate}</div>
       <div class="movements__value">${displayMovementCurrency}</div>
     </div>
   `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display total balance
const calculateDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  const currency = formatCurrency(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = currency;
};

// Display summary of deposit, withdraw & interest
const calculateDisplaySummary = function (acc) {
  // income
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const incomeCurrency = formatCurrency(income, acc.locale, acc.currency);

  labelSumIn.textContent = incomeCurrency;

  // out
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outCurrency = formatCurrency(out, acc.locale, acc.currency);

  labelSumOut.textContent = outCurrency;

  // interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);

  const interestCurrency = formatCurrency(interest, acc.locale, acc.currency);

  labelSumInterest.textContent = interestCurrency;
};

// Format username
const createUserNames = function (accs) {
  // forEach produce side effect
  accs.forEach(function (acc, i) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};

const updateUI = function (acc) {
  // display movements
  displayMovements(acc);

  // display balance
  calculateDisplayBalance(acc);

  // display summary
  calculateDisplaySummary(acc);
};

// Event listeners
let currentAccount;

// FAKE ALWAYS LOGGED IN - TESTING PURPOSES
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // find if current acc exists
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // check pin
  if (currentAccount?.pin === +inputLoginPin.value) {
    // display UI & message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // update the UI
    updateUI(currentAccount);

    // create current date - internationalization
    const now = new Date();
    let options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});

// create a user;
createUserNames(accounts);

// TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  console.log(amount, receiverAcc);

  // receiverAcc, amount & currentAcc checking
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.username !== receiverAcc?.username &&
    currentAccount.balance >= amount
  ) {
    // if success, do transfer
    console.log('transfer valid!');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }

  // add date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());

  // update the UI
  updateUI(currentAccount);

  // clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
});

// REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    currentAccount.movements.push(amount);
  } else {
    console.log('requested loan is too big!');
  }

  // add date
  currentAccount.movementsDates.push(new Date().toISOString());

  // Update the UI
  updateUI(currentAccount);

  // clear input field
  inputLoanAmount.value = '';
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // delete account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    // remove the UI
    containerApp.style.opacity = 0;
  }

  // clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// PRACTICE & EXERCISES FOR ARRAYS

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Exercise 1

// const dogsJulia1 = [3, 5, 2, 12, 7];
// const dogsKate1 = [4, 1, 15, 8, 3];

// const dogsJulia2 = [9, 16, 6, 8, 3];
// const dogsKate2 = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   let copy = dogsJulia.slice();
//   copy.splice(0, 1); // get the first number in dogsJulia array
//   copy.splice(-2); // get the last two number in dogsJulia array
//   const correctedDogsJulia = copy.concat(dogsKate);

//   correctedDogsJulia.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old.`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy.🐶`);
//     }
//   });
// };

// checkDogs(dogsJulia2, dogsKate2);

// const euroToUSD = 1.1;

// const movementsToUSD = account1.movements.map(mov => mov * euroToUSD);

// console.log(account1.movements);
// console.log(movementsToUSD);

// Reduce
// Calculate maximum value

// const max = movements.reduce((acc, cur) => (acc > cur ? acc : cur));
// console.log(max);

// Exercise 2

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

//   // console.log(humanAges)
//   const adults = humanAges.filter(age => age >= 18);

//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   return average;
// };

// console.log('DATA #1: ' + calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log('DATA #2 ' + calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// const euroToUSD = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUSD)
//   .reduce((acc, mov) => acc + mov, 0);

// Exercise 3

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// Find
// const user = accounts.find(acc => acc.owner === 'Jane Doe');

// console.log(user);

// Some & every
// console.log(movements);

// // checks for equality
// console.log(movements.includes(-130));

// // Some: checks for condition
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// // Every
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));

// flat and flatMap

// flat
// const arr = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];

// console.log(arr.flat());

// const arrDeep = [[1, 2, [3, 4], [5, 6, 7], 8, 9]];
// console.log(arrDeep.flat(2));

// const arrMovements1 = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, cur) => acc + cur, 0);

// // flatMap
// const arrMovements2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(arrMovements1);
// console.log(arrMovements2);

// Sort - mutates array

// strings
// const owners = ['Xion', 'Mike', 'Kyle', 'Patrick'];
// console.log(owners.sort());

// // numbers
// console.log(movements);

// // return < 0, A, B (keep order)
// // return > 0. B, A (switch order)

// // ascending
// movements.sort((a, b) => a - b);
// console.log(movements);

// // descending
// movements.sort((a, b) => b - a);
// console.log(movements);

// programatically create & fill array

// empty array + fill method
// const arrFill = new Array(7);
// console.log(arrFill);

// // fill
// arrFill.fill(1);
// console.log(arrFill);

// // Array.from
// const x = Array.from({ length: 10 }, (_, i) => i + 1);
// const diceRolls = Array.from({ length: 100 }, (_, i) =>
//   Math.round(Math.random() * 100)
// );
// console.log(diceRolls);

// Arrays practice & challenge

// console.log(movements);
// // #1
// const bankDepositSum = accounts.flatMap(acc => acc.movements);
// const total = bankDepositSum.reduce((acc, cur) => acc + cur, 0);
// console.log(total);

// //#2
// const greaterThan1000 = movements.reduce(
//   (acc, cur) => (cur >= 1000 ? ++acc : acc),
//   0
// );
// console.log(greaterThan1000);

// // #3
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, cur) => {
//       // cur > 0 ? (sum.deposits += cur) : (sum.withdrawals += cur);
//       sum[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sum;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// //#4
// // this is a nice title -> This is a Nice Title
// const convertTitleCase = function (title) {
//   const exceptions = [
//     'a',
//     'an',
//     'and',
//     'the',
//     'but',
//     'or',
//     'on',
//     'in',
//     'with',
//     'is',
//   ];

//   const transform = word => word[0].toUpperCase() + word.slice(1);

//   const convertedTitle = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : transform(word)))
//     .join(' ');

//   return transform(convertedTitle);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not TOO long'));
// console.log(convertTitleCase('and here is ANOTHER title with an EXAMPLE'));

// PRACTICE & EXERCISES FOR NUMBERS, DATES, INTL & TIMERS

// Base 10 = 0 - 9
// Binary base 2 = 0 - 1

// console.log(0.1 + 0.2 === 0.3);

// // Conversion
// console.log(Number('23'));
// console.log(+'23');

// // Parsing
// console.log(Number.parseInt('22px'));
// console.log(Number.parseFloat('22.5px'));

// // checking if value is number
// console.log(Number.isNaN(22));
// console.log(Number.isNaN(+'22px'));
// console.log(Number.isFinite(13));
// console.log(Number.isFinite('13'));

// console.log(Number.isInteger(22));
// console.log(Number.isInteger(22 / 10));

// Math & Rounding
// console.log(Math.sqrt(25));
// console.log(Math.max(6, 18, 9, 2, 4));
// console.log(Math.min(6, 18, 9, 2, 4));

// console.log(Math.PI * 10);
// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// // Rounding integers
// console.log(Math.round(23.8));
// console.log(Math.ceil(23.8));
// console.log(Math.floor(23.8));
// console.log(Math.floor(-23.8));
// console.log((2.8).toFixed(1)); // returns string
// console.log(+(2.8).toFixed(1));

// Remainder
// console.log(5 % 2); // 2 * 2 + 1
// console.log(19 % 5); // 5 * 2 + 4
// console.log(6 % 2); // 6 * 2 + 0

// const isEven = n => n % 2 === 0;
// console.log(isEven(4));
// console.log(isEven(9));
// console.log(isEven(22));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0, 2, 4, 6...
//     if (i % 2 === 0) row.style.backgroundColor = '#ffecd8';
//     // 0, 3, 6, 9...
//     if (i % 3 === 0) row.style.backgroundColor = '#b5e2ff';
//     // useful for selecting nth child
//   });
// });

// Numeric Separators = _
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// console.log(Number('389_000')); // not gonna work (NaN)

// BigInt
// console.log(2 ** 53 - 1); // safe maximum integer
// console.log(Number.MAX_SAFE_INTEGER); // same as the code above

// BigInt - ES2020
// console.log(8934340209039232302930090043486404590494n);
// console.log(BigInt(8934340209039232302930090043486404590494));

// // operations
// console.log(40000000n + 6000000n);
// console.log(483984930437473434n + 23400000n);

// // exceptions
// console.log(20n > 18);
// console.log(20n === 20);
// console.log(20n == '20');

// console.log(2000n + 20); // not allowed

// Dates
// const now = new Date();
// console.log(now);

// // console.log(new Date('Sep 05 2024 19:30:34'));
// console.log(new Date('April 22 2001'));

// console.log(new Date(2029, 11, 1, 22, 0, 0));
// console.log(new Date(2029, 11, 32, 24, 0, 0)); // js automatically correct the date

// console.log(new Date(0)); // UNIX time starts
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); // 3 days after UNIX time starts

// Working with Dates
// const future = new Date(2029, 11, 1, 22, 0, 0);
// console.log(future);
// console.log('Year:', future.getFullYear());
// console.log('Month:', future.getMonth());
// console.log('Day of the Month:', future.getDate());
// console.log('Day of the Week:', future.getDay());
// console.log('Hours:', future.getHours());
// console.log('Seconds:', future.getSeconds());
// console.log('Milliseconds:', future.getMilliseconds());
// console.log('ISO format:', future.toISOString());
// console.log('Milliseconds passed since 01-01-1970:', future.getTime());

// console.log(new Date(2553516000000));

// console.log(Date.now()); // timestamp 01-01-1970 to current date

// future.setFullYear(2050);
// console.log(future);

// const future = new Date(2029, 11, 1, 22, 0, 0);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calcDaysPassed(new Date(2040, 4, 22), new Date(2040, 4, 12));

// console.log('Days:', days1);

// Internationalization

// numbers
const nums = 34398939.22;

const options = {
  style: 'currency',
  currency: 'PHP',
};

console.log('US:', new Intl.NumberFormat('en-US').format(nums));
console.log('Chinese SG:', new Intl.NumberFormat('zh-SG').format(nums));
console.log('Syria', new Intl.NumberFormat('ar-SY').format(nums));
console.log(
  'Philippines:',
  new Intl.NumberFormat('tg-PH', options).format(nums)
);
