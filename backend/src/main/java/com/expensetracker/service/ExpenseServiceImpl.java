package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.exception.ExpenseNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<Expense> getAllExpenses(String category) {
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            return expenseRepository.findByCategoryOrderByDateDesc(category.trim());
        }
        return expenseRepository.findAllByOrderByDateDesc();
    }

    @Override
    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
    }

    @Override
    public Expense createExpense(ExpenseRequest request) {
        Expense expense = new Expense(
                request.getTitle().trim(),
                round(request.getAmount()),
                request.getCategory().trim(),
                request.getDate(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );

        return expenseRepository.save(expense);
    }

    @Override
    public Expense updateExpense(Long id, ExpenseRequest request) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));

        existing.setTitle(request.getTitle().trim());
        existing.setAmount(round(request.getAmount()));
        existing.setCategory(request.getCategory().trim());
        existing.setDate(request.getDate());
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");

        return expenseRepository.save(existing);
    }

    @Override
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }
        expenseRepository.deleteById(id);
    }

    @Override
    public ExpenseSummaryResponse getSummary() {
        List<Expense> expenses = expenseRepository.findAll();

        double totalExpense = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        Map<String, Double> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));

        Map<String, Double> formattedCategoryTotals = new HashMap<>();
        categoryTotals.forEach((cat, amt) -> formattedCategoryTotals.put(cat, round(amt)));

        return new ExpenseSummaryResponse(
                round(totalExpense),
                expenses.size(),
                formattedCategoryTotals
        );
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
