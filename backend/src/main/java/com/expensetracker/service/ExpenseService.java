package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.entity.Expense;

import java.util.List;

public interface ExpenseService {

    List<Expense> getAllExpenses(String category);

    Expense getExpenseById(Long id);

    Expense createExpense(ExpenseRequest request);

    Expense updateExpense(Long id, ExpenseRequest request);

    void deleteExpense(Long id);

    ExpenseSummaryResponse getSummary();
}
