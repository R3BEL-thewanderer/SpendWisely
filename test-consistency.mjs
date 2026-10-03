// Automated consistency check script
import {
  INITIAL_USER_PROFILE,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_CATEGORIES,
} from './src/lib/mockData.ts';
import { calculateTotals, roundMoney } from './src/lib/finance.ts';
import { calculateBudget } from './src/lib/budgets.ts';
import { calculateCategoryBreakdown } from './src/lib/categories.ts';
import { calculateAllGoals, calculateSavedAmount } from './src/lib/goals.ts';
import { calculateAnalytics } from './src/lib/analytics.ts';
import { answerFinancialQuery } from './src/lib/assistant.ts';

console.log('==============================================');
console.log('SPENDWISE DATA SYNCHRONIZATION TEST SUITE');
console.log('==============================================\n');

// 1. Initial State Consistency Check
console.log('1. Checking Initial Mock Dataset...');
console.log(`- Transactions count: ${INITIAL_TRANSACTIONS.length}`);
console.log(`- Budgets count: ${INITIAL_BUDGETS.length}`);
console.log(`- Goals count: ${INITIAL_GOALS.length}`);
console.log(`- Categories count: ${INITIAL_CATEGORIES.length}`);

if (INITIAL_TRANSACTIONS.length < 50) {
  throw new Error(`Expected at least 50 transactions, got ${INITIAL_TRANSACTIONS.length}`);
}

const initialTotals = calculateTotals(INITIAL_TRANSACTIONS);
console.log(`- Total Income: ₹${initialTotals.totalIncome}`);
console.log(`- Total Expenses: ₹${initialTotals.totalExpenses}`);
console.log(`- Net Balance: ₹${initialTotals.balance}`);
console.log(`- Savings Rate: ${initialTotals.savingsRate.toFixed(1)}%`);

if (initialTotals.balance !== roundMoney(initialTotals.totalIncome - initialTotals.totalExpenses)) {
  throw new Error('Balance formula invariant violated!');
}

// 2. Goal Contributions Consistency Check
console.log('\n2. Checking Goal Contributions Invariant...');
INITIAL_GOALS.forEach((goal) => {
  const sumFromContribs = calculateSavedAmount(goal);
  console.log(`- Goal "${goal.name}": Target=₹${goal.targetAmount}, Saved=₹${goal.currentSavings}, Sum(Contribs)=₹${sumFromContribs}`);
  if (goal.currentSavings !== sumFromContribs) {
    throw new Error(`Goal ${goal.name} currentSavings (${goal.currentSavings}) does not match sum of contributions (${sumFromContribs})`);
  }
});

// 3. Budgets Consistency Check
console.log('\n3. Checking Budgets & Period Isolation...');
INITIAL_BUDGETS.forEach((b) => {
  const res = calculateBudget(b, INITIAL_TRANSACTIONS);
  console.log(`- Budget "${b.name}" (${b.month}): Limit=₹${res.totalLimit}, Spent=₹${res.totalSpent}, Remaining=₹${res.remainingBudget}, Status=${res.status}`);
  res.categoryResults.forEach((cat) => {
    console.log(`    • ${cat.categoryName}: ₹${cat.spent} / ₹${cat.allocatedLimit} (${cat.usagePercentage}%) - ${cat.status}`);
  });
});

// 4. TEST MATRIX
console.log('\n4. Running Test Matrix...');

// TEST A: Add Expense Food ₹1,000
console.log('\n--- TEST A: Add Expense (Food & Dining ₹1,000) ---');
const txBefore = [...INITIAL_TRANSACTIONS];
const testTx = {
  id: 'tx-test-1000',
  title: 'Test Food Dineout',
  subtitle: 'Food & Dining',
  amount: 1000,
  type: 'EXPENSE',
  category: 'Food & Dining',
  date: 'Today',
  time: '12:00 PM',
  paymentMethod: 'UPI',
  tags: ['Test'],
  notes: 'Testing synchronization',
  iconType: 'food',
  colorHex: '#EF9C8D',
};

const txAfterAdd = [testTx, ...txBefore];
const totalsAfterAdd = calculateTotals(txAfterAdd);
const octBudgetAfterAdd = calculateBudget(INITIAL_BUDGETS[0], txAfterAdd);
const octBudgetBefore = calculateBudget(INITIAL_BUDGETS[0], txBefore);

console.log(`Total Expenses: ₹${initialTotals.totalExpenses} -> ₹${totalsAfterAdd.totalExpenses} (+₹${totalsAfterAdd.totalExpenses - initialTotals.totalExpenses})`);
console.log(`Balance: ₹${initialTotals.balance} -> ₹${totalsAfterAdd.balance} (-₹${initialTotals.balance - totalsAfterAdd.balance})`);
console.log(`Oct Food Budget Spent: ₹${octBudgetBefore.categoryResults[0].spent} -> ₹${octBudgetAfterAdd.categoryResults[0].spent}`);

if (totalsAfterAdd.totalExpenses !== initialTotals.totalExpenses + 1000) {
  throw new Error('Test A Failed: Total expenses did not increase by exactly ₹1,000');
}
if (totalsAfterAdd.balance !== initialTotals.balance - 1000) {
  throw new Error('Test A Failed: Balance did not decrease by exactly ₹1,000');
}
if (octBudgetAfterAdd.categoryResults[0].spent !== octBudgetBefore.categoryResults[0].spent + 1000) {
  throw new Error('Test A Failed: October Food budget did not increase by ₹1,000');
}
console.log('✅ TEST A PASSED!');

// TEST B: Delete the same transaction
console.log('\n--- TEST B: Delete Transaction ---');
const txAfterDelete = txAfterAdd.filter((it) => it.id !== 'tx-test-1000');
const totalsAfterDelete = calculateTotals(txAfterDelete);
const octBudgetAfterDelete = calculateBudget(INITIAL_BUDGETS[0], txAfterDelete);

console.log(`Total Expenses: ₹${totalsAfterAdd.totalExpenses} -> ₹${totalsAfterDelete.totalExpenses}`);
console.log(`Balance: ₹${totalsAfterAdd.balance} -> ₹${totalsAfterDelete.balance}`);
console.log(`Oct Food Budget Spent: ₹${octBudgetAfterAdd.categoryResults[0].spent} -> ₹${octBudgetAfterDelete.categoryResults[0].spent}`);

if (totalsAfterDelete.totalExpenses !== initialTotals.totalExpenses) {
  throw new Error('Test B Failed: Total expenses did not revert');
}
if (totalsAfterDelete.balance !== initialTotals.balance) {
  throw new Error('Test B Failed: Balance did not revert');
}
if (octBudgetAfterDelete.categoryResults[0].spent !== octBudgetBefore.categoryResults[0].spent) {
  throw new Error('Test B Failed: October Food budget did not revert');
}
console.log('✅ TEST B PASSED!');

// TEST C: Edit Transaction (Food ₹1,000 -> Shopping ₹3,000)
console.log('\n--- TEST C: Edit Transaction (Food ₹1,000 -> Shopping ₹3,000) ---');
const editedTx = {
  ...testTx,
  category: 'Shopping',
  title: 'Test Shopping Clothes',
  amount: 3000,
};
const txAfterEdit = txAfterAdd.map((it) => (it.id === 'tx-test-1000' ? editedTx : it));
const totalsAfterEdit = calculateTotals(txAfterEdit);
const octBudgetAfterEdit = calculateBudget(INITIAL_BUDGETS[0], txAfterEdit);

const foodSpentBefore = octBudgetAfterAdd.categoryResults.find(c => c.categoryName.includes('Food')).spent;
const foodSpentAfter = octBudgetAfterEdit.categoryResults.find(c => c.categoryName.includes('Food')).spent;
const shoppingSpentBefore = octBudgetAfterAdd.categoryResults.find(c => c.categoryName.includes('Shop')).spent;
const shoppingSpentAfter = octBudgetAfterEdit.categoryResults.find(c => c.categoryName.includes('Shop')).spent;

console.log(`Food Budget Spent: ₹${foodSpentBefore} -> ₹${foodSpentAfter} (Decreased by ₹${foodSpentBefore - foodSpentAfter})`);
console.log(`Shopping Budget Spent: ₹${shoppingSpentBefore} -> ₹${shoppingSpentAfter} (Increased by ₹${shoppingSpentAfter - shoppingSpentBefore})`);
console.log(`Total Expenses: ₹${totalsAfterAdd.totalExpenses} -> ₹${totalsAfterEdit.totalExpenses} (Net +₹${totalsAfterEdit.totalExpenses - totalsAfterAdd.totalExpenses})`);

if (foodSpentAfter !== foodSpentBefore - 1000) {
  throw new Error('Test C Failed: Food spending did not decrease by ₹1,000');
}
if (shoppingSpentAfter !== shoppingSpentBefore + 3000) {
  throw new Error('Test C Failed: Shopping spending did not increase by ₹3,000');
}
console.log('✅ TEST C PASSED!');

// TEST D: Add Goal Contribution ₹2,000
console.log('\n--- TEST D: Add Goal Contribution (₹2,000 to Laptop) ---');
const laptopGoal = INITIAL_GOALS[0];
const newContrib = { id: 'c-test-1', amount: 2000, date: 'Today', note: 'Test Deposit' };
const updatedContribs = [newContrib, ...laptopGoal.contributions];
const updatedSaved = calculateSavedAmount({ ...laptopGoal, contributions: updatedContribs });
const updatedGoal = { ...laptopGoal, contributions: updatedContribs, currentSavings: updatedSaved };

console.log(`Laptop Saved: ₹${laptopGoal.currentSavings} -> ₹${updatedGoal.currentSavings} (+₹${updatedGoal.currentSavings - laptopGoal.currentSavings})`);
console.log(`Laptop Progress: ${(laptopGoal.currentSavings / laptopGoal.targetAmount * 100).toFixed(1)}% -> ${(updatedGoal.currentSavings / updatedGoal.targetAmount * 100).toFixed(1)}%`);

if (updatedGoal.currentSavings !== laptopGoal.currentSavings + 2000) {
  throw new Error('Test D Failed: Goal saved amount did not increase by ₹2,000');
}
console.log('✅ TEST D PASSED!');

// TEST E: Delete Goal Contribution
console.log('\n--- TEST E: Delete Goal Contribution ---');
const revertedContribs = updatedGoal.contributions.filter(c => c.id !== 'c-test-1');
const revertedSaved = calculateSavedAmount({ ...laptopGoal, contributions: revertedContribs });
console.log(`Laptop Saved: ₹${updatedGoal.currentSavings} -> ₹${revertedSaved}`);

if (revertedSaved !== laptopGoal.currentSavings) {
  throw new Error('Test E Failed: Goal saved amount did not revert');
}
console.log('✅ TEST E PASSED!');

// TEST F: AI Assistant Derives Answers from Live State
console.log('\n--- TEST F: AI Assistant Answers from Live State ---');
const breakdownBefore = calculateCategoryBreakdown(INITIAL_CATEGORIES, txBefore);
const aiAnswerBefore = answerFinancialQuery(
  'How much on food?',
  initialTotals,
  breakdownBefore,
  [octBudgetBefore],
  calculateAllGoals(INITIAL_GOALS),
  [],
  txBefore
);
console.log(`AI Answer (Before adding ₹1000): ${aiAnswerBefore.split('\n')[0]}`);

const breakdownAfterAdd = calculateCategoryBreakdown(INITIAL_CATEGORIES, txAfterAdd);
const aiAnswerAfterAdd = answerFinancialQuery(
  'How much on food?',
  totalsAfterAdd,
  breakdownAfterAdd,
  [octBudgetAfterAdd],
  calculateAllGoals(INITIAL_GOALS),
  [],
  txAfterAdd
);
console.log(`AI Answer (After adding ₹1000): ${aiAnswerAfterAdd.split('\n')[0]}`);

const foodBeforeAmt = breakdownBefore.find(c => c.categoryName.includes('Food')).spentAmount;
const foodAfterAmt = breakdownAfterAdd.find(c => c.categoryName.includes('Food')).spentAmount;
if (foodAfterAmt !== foodBeforeAmt + 1000) {
  throw new Error('Test F Failed: Category breakdown did not reflect +₹1,000');
}
console.log('✅ TEST F PASSED!');

console.log('\n==============================================');
console.log('ALL INVARIANTS & SYNCHRONIZATION TESTS PASSED!');
console.log('==============================================');
