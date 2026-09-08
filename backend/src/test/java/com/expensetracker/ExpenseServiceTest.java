package com.expensetracker;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.exception.ExpenseNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.service.ExpenseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    private Expense sampleExpense;
    private ExpenseRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleExpense = new Expense(
                1L,
                "Grocery Shopping",
                45.50,
                "Food",
                LocalDate.of(2026, 3, 1),
                "Supermarket items"
        );

        sampleRequest = new ExpenseRequest(
                "Grocery Shopping",
                45.50,
                "Food",
                LocalDate.of(2026, 3, 1),
                "Supermarket items"
        );
    }

    @Test
    void testCreateExpense() {
        when(expenseRepository.save(any(Expense.class))).thenReturn(sampleExpense);

        Expense created = expenseService.createExpense(sampleRequest);

        assertNotNull(created);
        assertEquals("Grocery Shopping", created.getTitle());
        assertEquals(45.50, created.getAmount());
        assertEquals("Food", created.getCategory());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void testGetAllExpenses_WithoutFilter() {
        when(expenseRepository.findAllByOrderByDateDesc()).thenReturn(List.of(sampleExpense));

        List<Expense> result = expenseService.getAllExpenses(null);

        assertEquals(1, result.size());
        verify(expenseRepository, times(1)).findAllByOrderByDateDesc();
    }

    @Test
    void testGetAllExpenses_WithCategoryFilter() {
        when(expenseRepository.findByCategoryOrderByDateDesc("Food")).thenReturn(List.of(sampleExpense));

        List<Expense> result = expenseService.getAllExpenses("Food");

        assertEquals(1, result.size());
        assertEquals("Food", result.get(0).getCategory());
        verify(expenseRepository, times(1)).findByCategoryOrderByDateDesc("Food");
    }

    @Test
    void testGetExpenseById_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(sampleExpense));

        Expense found = expenseService.getExpenseById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void testGetExpenseById_NotFound() {
        when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ExpenseNotFoundException.class, () -> expenseService.getExpenseById(99L));
    }

    @Test
    void testUpdateExpense_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(sampleExpense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(sampleExpense);

        ExpenseRequest updateReq = new ExpenseRequest(
                "Updated Grocery",
                60.00,
                "Food",
                LocalDate.of(2026, 3, 2),
                "Updated desc"
        );

        Expense updated = expenseService.updateExpense(1L, updateReq);

        assertNotNull(updated);
        verify(expenseRepository, times(1)).save(sampleExpense);
    }

    @Test
    void testDeleteExpense_Success() {
        when(expenseRepository.existsById(1L)).thenReturn(true);
        doNothing().when(expenseRepository).deleteById(1L);

        expenseService.deleteExpense(1L);

        verify(expenseRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteExpense_NotFound() {
        when(expenseRepository.existsById(99L)).thenReturn(false);

        assertThrows(ExpenseNotFoundException.class, () -> expenseService.deleteExpense(99L));
        verify(expenseRepository, never()).deleteById(99L);
    }

    @Test
    void testGetSummary() {
        Expense e1 = new Expense(1L, "Lunch", 25.0, "Food", LocalDate.now(), null);
        Expense e2 = new Expense(2L, "Taxi", 15.0, "Travel", LocalDate.now(), null);
        Expense e3 = new Expense(3L, "Dinner", 30.0, "Food", LocalDate.now(), null);

        when(expenseRepository.findAll()).thenReturn(Arrays.asList(e1, e2, e3));

        ExpenseSummaryResponse summary = expenseService.getSummary();

        assertNotNull(summary);
        assertEquals(70.0, summary.getTotalExpense());
        assertEquals(3, summary.getTotalCount());
        assertEquals(55.0, summary.getCategoryWiseTotal().get("Food"));
        assertEquals(15.0, summary.getCategoryWiseTotal().get("Travel"));
    }
}
