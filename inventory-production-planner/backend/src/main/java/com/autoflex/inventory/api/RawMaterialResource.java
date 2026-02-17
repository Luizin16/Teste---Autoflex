package com.autoflex.inventory.api;

import com.autoflex.inventory.api.dto.RawMaterialRequest;
import com.autoflex.inventory.domain.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/raw-materials")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> list() {
        return RawMaterial.listAll();
    }

    @GET
    @Path("/{id}")
    public RawMaterial get(@PathParam("id") Long id) {
        RawMaterial rm = RawMaterial.findById(id);
        if (rm == null) throw new NotFoundException("Raw material not found");
        return rm;
    }

    @POST
    @Transactional
    public Response create(@Valid RawMaterialRequest request) {
        if (RawMaterial.find("code", request.code).firstResult() != null) {
            throw new BadRequestException("Raw material code already exists");
        }
        RawMaterial rm = new RawMaterial();
        rm.code = request.code;
        rm.name = request.name;
        rm.stockQuantity = request.stockQuantity;
        rm.persist();
        return Response.status(Response.Status.CREATED).entity(rm).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, @Valid RawMaterialRequest request) {
        RawMaterial rm = RawMaterial.findById(id);
        if (rm == null) throw new NotFoundException("Raw material not found");

        RawMaterial other = RawMaterial.find("code", request.code).firstResult();
        if (other != null && !other.id.equals(id)) {
            throw new BadRequestException("Raw material code already exists");
        }

        rm.code = request.code;
        rm.name = request.name;
        rm.stockQuantity = request.stockQuantity;
        return rm;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        RawMaterial rm = RawMaterial.findById(id);
        if (rm == null) throw new NotFoundException("Raw material not found");
        rm.delete();
        return Response.noContent().build();
    }
}
