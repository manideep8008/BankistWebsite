'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'anudeep reddy',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'saurav kumar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'divyansh guptha',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'suresh kumar raina',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements=function(movements,sort=false){
  containerMovements.innerHTML=''
  const movs=sort ? movements.slice().sort((a,b)=> a-b):movements


  movs.forEach(function(mov,i){
    const type = mov >0 ?'deposit':'withdrawal';
    const html=`
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1}. ${type}</div>
          
          <div class="movements__value">${mov}₹</div>
        </div>`
        containerMovements.insertAdjacentHTML('afterbegin',html);
  });
}
displayMovements(account1.movements)

const createUserNames=function(accs){
  accs.forEach(function(acc){
    acc.username=acc.owner.toLowerCase().split(' ').map(user=> user[0]).join('')})
  }
createUserNames(accounts)


//  const deposits=movements.filter(function(mov){
//   return mov>0;
//  })
//  console.log(deposits);
//  const withdrawals=movements.filter(function(mov){
//   return mov< 0;
//  })
//  console.log(withdrawals);
const displayBalance=function(acc){
  acc.balance=acc.movements.reduce(function(acc,curr,i,arr){
    return acc+curr})

  labelBalance.textContent=`${acc.balance}₹`
  
}
console.log(displayBalance(account1))

const calDisplaySumamry=function(movements,interestRate){
  const incomes=movements.filter(mov => mov>0).reduce((acc,mov)=>acc+mov)
  labelSumIn.textContent=`${incomes}₹`

  const outgoes=movements.filter(mov => mov<0).reduce((acc,mov)=>acc+mov)
  // console.log(outgoes);
  
  labelSumOut.textContent=`${Math.abs(outgoes)}₹`

  const interest=movements.filter(mov => mov>0).map(deposit => (deposit*interestRate)/100).filter(inte => inte>1).reduce((acc,mov)=>acc+mov,0)
  labelSumInterest.textContent=`${interest}₹`
  
    
}
calDisplaySumamry(account1.movements)


const updateUi=function(currAct){
  displayMovements(currAct.movements)
  displayBalance(currAct)
  calDisplaySumamry(currAct.movements,currAct.interestRate)
}


//event handlers
let currAct
btnLogin.addEventListener('click',function(e){
  e.preventDefault()
  currAct=accounts.find(acc=>acc.username === inputLoginUsername.value);
  if(currAct?.pin === Number(inputLoginPin.value)){
   //display ui and welcome msg
   labelWelcome.textContent=`Welcome back, ${currAct.owner.split(' ')[0]}`
   containerApp.style.opacity=100
    //display movements and summary balance
    
    updateUi(currAct)
    inputLoginUsername.value=inputLoginPin.value=''
   }
})
btnTransfer.addEventListener('click',function(e){
  e.preventDefault()
  const amount=Number(inputTransferAmount.value)
  const recieverAct=accounts.find(acc=>acc.username===inputTransferTo.value)
  inputTransferAmount.value=inputTransferTo.value=' '
  if(amount>0 && recieverAct && currAct.balance>=amount && recieverAct?.username!== currAct.username){
    currAct.movements.push(-amount)
    recieverAct.movements.push(amount)
    updateUi(currAct)
  }
})
btnClose.addEventListener('click',function(e){
  e.preventDefault()
  if(inputCloseUsername.value === currAct.username && currAct.pin=== Number(inputClosePin.value)){
    const index=accounts.findIndex(acc=>acc.username===currAct.username)
    console.log(index);
    accounts.splice(index,1)

    containerApp.style.opacity=0
  }
  inputCloseUsername.value=inputClosePin.value=' '
})
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const loan=Number(inputLoanAmount.value);
  if(loan>0 && currAct.movements.some(mov=>mov >= 0.1*loan)){
    currAct.movements.push(loan)
    updateUi(currAct)
    
  }
  inputLoanAmount.value=' '
})
let state=false;//not clicked
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currAct.movements,!state)
  state=!state;
  // if(state===0){
  //   displayMovements(currAct.movements,true)
  //   state=1;
  // }
  // else{
  //   displayMovements(currAct.movements,false)
  //   state=0
  // }

})







// // console.log(account4.movements.every(mov=>mov>0 ));
// const arr=[[9,8,7],[6,5,4],1,2,3]
// console.log(arr.flat());
// const bankMovements=accounts.map(acc=>acc.movements).flat().reduce((acc,mov)=>acc+mov)
// console.log(bankMovements);


// const bankMovements1=accounts.flatMap(acc=>acc.movements).reduce((acc,mov)=>acc+mov)
// console.log(bankMovements1);
// console.log(movements);
// movements.sort((a,b) => a-b)
// console.log(movements);
// movements.sort((a,b) => b-a)
// console.log(movements);
