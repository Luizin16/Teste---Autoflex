package com.autoflex.inventory.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductionSuggestionResponse {

    public List<Item> items;
    public BigDecimal totalRevenue;

    public static class Item {
        public Long productId;
        public String productCode;
        public String productName;
        public BigDecimal unitPrice;
        public Long quantity;
        public BigDecimal subtotal;

        public Item() {}

        public Item(Long productId, String productCode, String productName, BigDecimal unitPrice, Long quantity, BigDecimal subtotal) {
            this.productId = productId;
            this.productCode = productCode;
            this.productName = productName;
            this.unitPrice = unitPrice;
            this.quantity = quantity;
            this.subtotal = subtotal;
        }
    }
}
