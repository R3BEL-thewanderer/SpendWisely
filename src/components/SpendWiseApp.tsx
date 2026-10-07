'use client';

import React from 'react';
import { SpendWiseProvider, useSpendWise } from '../context/SpendWiseContext';
import { AddCategoryModal } from './AddCategoryModal';
import { AddExpenseModal } from './AddExpenseModal';
import { AddIncomeModal } from './AddIncomeModal';
import { AddMoneyGoalModal } from './AddMoneyGoalModal';
import { AiAssistantModal } from './AiAssistantModal';
import { AnalyticsScreen } from './AnalyticsScreen';
import { AuthModals } from './AuthModals';
import { BottomNavigation } from './BottomNavigation';
import { BudgetsScreen } from './BudgetsScreen';
import { CategoriesScreen } from './CategoriesScreen';
import { CreateBudgetModal } from './CreateBudgetModal';
import { CreateGoalModal } from './CreateGoalModal';
import { GoalsScreen } from './GoalsScreen';
import { HomeScreen } from './HomeScreen';
import { LandingScreen } from './LandingScreen';
import { PhoneShell } from './PhoneShell';
import { ProfileScreen } from './ProfileScreen';
import { ScanReceiptModal } from './ScanReceiptModal';
import { TransactionDetailModal } from './TransactionDetailModal';
import { TransactionsScreen } from './TransactionsScreen';

function ScreenRenderer() {
  const { currentScreen } = useSpendWise();

  switch (currentScreen) {
    case 'LANDING':
      return <LandingScreen />;
    case 'HOME':
      return <HomeScreen />;
    case 'TRANSACTIONS':
      return <TransactionsScreen />;
    case 'BUDGETS':
      return <BudgetsScreen />;
    case 'CATEGORIES':
      return <CategoriesScreen />;
    case 'GOALS':
    case 'GOAL_DETAIL':
      return <GoalsScreen />;
    case 'ANALYTICS':
      return <AnalyticsScreen />;
    case 'PROFILE':
    case 'SETTINGS':
      return <ProfileScreen />;
    default:
      return <HomeScreen />;
  }
}

function MainContent() {
  const { currentScreen } = useSpendWise();
  const isLanding = currentScreen === 'LANDING';

  return (
    <div className="relative flex-1 w-full max-w-full min-h-0 flex flex-col overflow-hidden overflow-x-hidden">
      <div
        key={currentScreen}
        className="page-screen-container relative flex-1 w-full max-w-full min-h-0 flex flex-col overflow-hidden overflow-x-hidden"
      >
        <ScreenRenderer />
      </div>
      {!isLanding && <BottomNavigation />}
    </div>
  );
}

export function SpendWiseApp() {
  return (
    <SpendWiseProvider>
      <PhoneShell>
        <MainContent />

        {/* Modal Sheet Overlays */}
        <AddExpenseModal />
        <AddIncomeModal />
        <AddCategoryModal />
        <AddMoneyGoalModal />
        <CreateGoalModal />
        <CreateBudgetModal />
        <TransactionDetailModal />
        <AiAssistantModal />
        <ScanReceiptModal />
        <AuthModals />
      </PhoneShell>
    </SpendWiseProvider>
  );
}
