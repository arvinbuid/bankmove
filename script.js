'use strict';

// Data
const account1 = {
  owner: 'Mary Jane Watson',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Peter Parker',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

// Display deposit & withdrawals
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  // sort movements if true
  const movsSort = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : movements;

  // loop movements
  movsSort.map((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
     <div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__value">${mov.toFixed(2)}</div>
     </div>
   `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display total balance
const calculateDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${acc.balance} €`;
};

// Display summary of deposit, withdraw & interest
const calculateDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)

    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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

// Event listeners
let currentAccount;
let pin;

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

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // update the UI
    updateUI(currentAccount);
  }
});

// create a user;
createUserNames(accounts);

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calculateDisplayBalance(acc);

  // display summary
  calculateDisplaySummary(acc);
};

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

  // clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';

  // update the UI
  updateUI(currentAccount);
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
  displayMovements(currentAccount.movements, !sorted);
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

// // conversion
// console.log(Number('23'));
// console.log(+'23');

// // parsing
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
