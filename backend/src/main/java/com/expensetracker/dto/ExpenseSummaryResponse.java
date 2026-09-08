package com.expensetracker.dto;

import java.util.Map;

public class ExpenseSummaryResponse {

    private Double totalExpense;
    private long totalCount;
    private Map<String, Double> categoryWiseTotal;

    public ExpenseSummaryResponse() {
    }

    public ExpenseSummaryResponse(Double totalExpense, long totalCount, Map<String, Double> categoryWiseTotal) {
        this.totalExpense = totalExpense;
        this.totalCount = totalCount;
        this.categoryWiseTotal = categoryWiseTotal;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public Map<String, Double> getCategoryWiseTotal() {
        return categoryWiseTotal;
    }

    public void setCategoryWiseTotal(Map<String, Double> categoryWiseTotal) {
        this.categoryWiseTotal = categoryWiseTotal;
    }
}
