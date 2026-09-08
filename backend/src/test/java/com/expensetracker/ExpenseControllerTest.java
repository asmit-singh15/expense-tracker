package com.expensetracker;

import com.expensetracker.controller.ExpenseController;
import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.exception.ExpenseNotFoundException;
import com.expensetracker.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExpenseController.class)
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExpenseService expenseService;

    private Expense sampleExpense;
    private ExpenseRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleExpense = new Expense(
                1L,
                "Books",
                50.0,
                "Education",
                LocalDate.of(2026, 3, 1),
                "Textbooks for semester"
        );

        sampleRequest = new ExpenseRequest(
                "Books",
                50.0,
                "Education",
                LocalDate.of(2026, 3, 1),
                "Textbooks for semester"
        );
    }

    @Test
    void testCreateExpense_Valid() throws Exception {
        when(expenseService.createExpense(any(ExpenseRequest.class))).thenReturn(sampleExpense);

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Books"))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.category").value("Education"));
    }

    @Test
    void testCreateExpense_InvalidAmount_ReturnsBadRequest() throws Exception {
        ExpenseRequest invalidRequest = new ExpenseRequest(
                "Books",
                -10.0, // Invalid: must be positive
                "Education",
                LocalDate.now(),
                null
        );

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.amount").exists());
    }

    @Test
    void testGetAllExpenses() throws Exception {
        when(expenseService.getAllExpenses(null)).thenReturn(List.of(sampleExpense));

        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].title").value("Books"));
    }

    @Test
    void testGetExpenseById_Found() throws Exception {
        when(expenseService.getExpenseById(1L)).thenReturn(sampleExpense);

        mockMvc.perform(get("/api/expenses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Books"));
    }

    @Test
    void testGetExpenseById_NotFound() throws Exception {
        when(expenseService.getExpenseById(99L)).thenThrow(new ExpenseNotFoundException(99L));

        mockMvc.perform(get("/api/expenses/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Expense not found with id: 99"));
    }

    @Test
    void testUpdateExpense() throws Exception {
        when(expenseService.updateExpense(eq(1L), any(ExpenseRequest.class))).thenReturn(sampleExpense);

        mockMvc.perform(put("/api/expenses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testDeleteExpense() throws Exception {
        doNothing().when(expenseService).deleteExpense(1L);

        mockMvc.perform(delete("/api/expenses/1"))
                .andExpect(status().isNoContent());

        verify(expenseService, times(1)).deleteExpense(1L);
    }

    @Test
    void testGetSummary() throws Exception {
        ExpenseSummaryResponse summary = new ExpenseSummaryResponse(
                120.50,
                4,
                Map.of("Food", 80.0, "Bills", 40.50)
        );

        when(expenseService.getSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/expenses/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalExpense").value(120.50))
                .andExpect(jsonPath("$.totalCount").value(4))
                .andExpect(jsonPath("$.categoryWiseTotal.Food").value(80.0))
                .andExpect(jsonPath("$.categoryWiseTotal.Bills").value(40.50));
    }
}
