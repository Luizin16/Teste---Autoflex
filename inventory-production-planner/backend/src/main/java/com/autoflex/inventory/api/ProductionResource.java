package com.autoflex.inventory.api;

import com.autoflex.inventory.api.dto.ProductionSuggestionResponse;
import com.autoflex.inventory.service.ProductionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

    @Inject
    ProductionService productionService;

    @GET
    @Path("/suggestion")
    public ProductionSuggestionResponse suggestion() {
        return productionService.suggestProduction();
    }
}
