package com.autoflex.inventory.api;

import com.autoflex.inventory.api.dto.BomItemRequest;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductRawMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/products/{productId}/bom")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class BomResource {

    @GET
    public List<ProductRawMaterial> list(@PathParam("productId") Long productId) {
        ensureProduct(productId);
        return ProductRawMaterial.find("product.id = ?1", productId).list();
    }

    @POST
    @Transactional
    public Response add(@PathParam("productId") Long productId, @Valid BomItemRequest request) {
        Product product = ensureProduct(productId);
        RawMaterial rm = RawMaterial.findById(request.rawMaterialId);
        if (rm == null) throw new NotFoundException("Raw material not found");

        if (ProductRawMaterial.find("product.id = ?1 and rawMaterial.id = ?2", productId, request.rawMaterialId).firstResult() != null) {
            throw new BadRequestException("BOM item already exists for this raw material");
        }

        ProductRawMaterial pr = new ProductRawMaterial();
        pr.product = product;
        pr.rawMaterial = rm;
        pr.requiredQuantity = request.requiredQuantity;
        pr.persist();

        return Response.status(Response.Status.CREATED).entity(pr).build();
    }

    @PUT
    @Path("/{bomItemId}")
    @Transactional
    public ProductRawMaterial update(@PathParam("productId") Long productId,
                                    @PathParam("bomItemId") Long bomItemId,
                                    @Valid BomItemRequest request) {
        ensureProduct(productId);
        ProductRawMaterial pr = ProductRawMaterial.findById(bomItemId);
        if (pr == null || pr.product == null || !pr.product.id.equals(productId)) {
            throw new NotFoundException("BOM item not found");
        }

        RawMaterial rm = RawMaterial.findById(request.rawMaterialId);
        if (rm == null) throw new NotFoundException("Raw material not found");

        // If changing raw material, keep uniqueness
        ProductRawMaterial duplicate = ProductRawMaterial.find("product.id = ?1 and rawMaterial.id = ?2", productId, request.rawMaterialId).firstResult();
        if (duplicate != null && !duplicate.id.equals(bomItemId)) {
            throw new BadRequestException("BOM item already exists for this raw material");
        }

        pr.rawMaterial = rm;
        pr.requiredQuantity = request.requiredQuantity;
        return pr;
    }

    @DELETE
    @Path("/{bomItemId}")
    @Transactional
    public Response delete(@PathParam("productId") Long productId, @PathParam("bomItemId") Long bomItemId) {
        ensureProduct(productId);
        ProductRawMaterial pr = ProductRawMaterial.findById(bomItemId);
        if (pr == null || pr.product == null || !pr.product.id.equals(productId)) {
            throw new NotFoundException("BOM item not found");
        }
        pr.delete();
        return Response.noContent().build();
    }

    private Product ensureProduct(Long productId) {
        Product product = Product.findById(productId);
        if (product == null) throw new NotFoundException("Product not found");
        return product;
    }
}
