'use strict';

// Data
const account1 = {
  owner: 'Steven Thomas Williams',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jane Doe',
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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

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

const calculateDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${balance} €`;
};

const calculateDisplaySummary = function (movements) {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// display deposit & withdrawals
displayMovements(account1.movements);

// display total balance
calculateDisplayBalance(account1.movements);

// display summary of deposit, withdraw & interest
calculateDisplaySummary(account1.movements);

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

createUserNames(accounts);

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
