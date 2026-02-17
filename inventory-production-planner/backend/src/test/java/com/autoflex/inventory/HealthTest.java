package com.autoflex.inventory;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class HealthTest {

    @Test
    void swaggerIsAvailable() {
        given()
          .when().get("/q/swagger-ui")
          .then()
             .statusCode(anyOf(is(200), is(302)));
    }
}
