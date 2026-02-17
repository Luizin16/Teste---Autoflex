package com.autoflex.inventory.service;

import com.autoflex.inventory.api.dto.ProductionSuggestionResponse;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductRawMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductionService {

    @Transactional
    public ProductionSuggestionResponse suggestProduction() {
        // Load all raw materials into a mutable stock map
        List<RawMaterial> rawMaterials = RawMaterial.listAll();
        Map<Long, Long> stockByRawId = new HashMap<>();
        for (RawMaterial rm : rawMaterials) {
            stockByRawId.put(rm.id, rm.stockQuantity);
        }

        // Load products ordered by price desc, then code asc for determinism
        List<Product> products = Product.find("order by price desc, code asc").list();

        List<ProductionSuggestionResponse.Item> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Product product : products) {
            List<ProductRawMaterial> bom = ProductRawMaterial.find("product.id = ?1", product.id).list();
            if (bom.isEmpty()) continue;

            long maxQty = Long.MAX_VALUE;

            for (ProductRawMaterial pr : bom) {
                long stock = stockByRawId.getOrDefault(pr.rawMaterial.id, 0L);
                long req = pr.requiredQuantity;
                if (req <= 0) {
                    maxQty = 0;
                    break;
                }
                long possible = stock / req;
                maxQty = Math.min(maxQty, possible);
                if (maxQty == 0) break;
            }

            if (maxQty <= 0 || maxQty == Long.MAX_VALUE) continue;

            // Consume stock
            for (ProductRawMaterial pr : bom) {
                long stock = stockByRawId.getOrDefault(pr.rawMaterial.id, 0L);
                long used = pr.requiredQuantity * maxQty;
                stockByRawId.put(pr.rawMaterial.id, stock - used);
            }

            BigDecimal subtotal = product.price.multiply(BigDecimal.valueOf(maxQty));
            total = total.add(subtotal);

            items.add(new ProductionSuggestionResponse.Item(
                    product.id,
                    product.code,
                    product.name,
                    product.price,
                    maxQty,
                    subtotal
            ));
        }

        ProductionSuggestionResponse response = new ProductionSuggestionResponse();
        response.items = items;
        response.totalRevenue = total;
        return response;
    }
}
