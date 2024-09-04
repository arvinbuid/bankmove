'use strict';

// Data
const account1 = {
  owner: 'Steven Thomas Williams',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'James Dean',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Kyle Davis',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  // loop movements
  movements.map((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
     <div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__value">${mov}</div>
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
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
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

  const amount = Number(inputTransferAmount.value);
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

  const amount = Number(inputLoanAmount.value);

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
    Number(inputClosePin.value) === currentAccount.pin
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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

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
