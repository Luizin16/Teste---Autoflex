package com.autoflex.inventory.api;

import com.autoflex.inventory.api.dto.ProductRequest;
import com.autoflex.inventory.domain.Product;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/products")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProductResource {

    @GET
    public List<Product> list() {
        return Product.listAll();
    }

    @GET
    @Path("/{id}")
    public Product get(@PathParam("id") Long id) {
        Product p = Product.findById(id);
        if (p == null) throw new NotFoundException("Product not found");
        return p;
    }

    @POST
    @Transactional
    public Response create(@Valid ProductRequest request) {
        if (Product.find("code", request.code).firstResult() != null) {
            throw new BadRequestException("Product code already exists");
        }
        Product p = new Product();
        p.code = request.code;
        p.name = request.name;
        p.price = request.price;
        p.persist();
        return Response.status(Response.Status.CREATED).entity(p).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Product update(@PathParam("id") Long id, @Valid ProductRequest request) {
        Product p = Product.findById(id);
        if (p == null) throw new NotFoundException("Product not found");

        Product other = Product.find("code", request.code).firstResult();
        if (other != null && !other.id.equals(id)) {
            throw new BadRequestException("Product code already exists");
        }

        p.code = request.code;
        p.name = request.name;
        p.price = request.price;
        return p;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Product p = Product.findById(id);
        if (p == null) throw new NotFoundException("Product not found");
        p.delete();
        return Response.noContent().build();
    }
}
