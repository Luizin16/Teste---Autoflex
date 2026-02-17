package com.autoflex.inventory.api;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException exception) {
        // Simple safe response (keeps the test small). In real systems you would map by type.
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", exception.getMessage() == null ? "Unexpected error" : exception.getMessage()))
                .build();
    }
}
