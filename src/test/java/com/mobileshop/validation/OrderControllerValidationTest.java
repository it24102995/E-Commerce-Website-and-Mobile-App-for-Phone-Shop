package com.mobileshop.validation;

import com.mobileshop.config.GlobalExceptionHandler;
import com.mobileshop.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = com.mobileshop.controller.OrderController.class)
@Import(GlobalExceptionHandler.class)
class OrderControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Test
    void placeOrder_shouldFailWhenItemQuantityInvalid() throws Exception {
        String payload = """
                {
                  "userId": 1,
                  "items": [
                    { "productId": 10, "quantity": 0 }
                  ],
                  "paymentMethod": "CASH_ON_DELIVERY"
                }
                """;

        mockMvc.perform(post("/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void placeOrder_shouldFailWhenPaymentMethodMissing() throws Exception {
        String payload = """
                {
                  "userId": 1,
                  "items": [
                    { "productId": 10, "quantity": 1 }
                  ]
                }
                """;

        mockMvc.perform(post("/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getOrders_shouldFailWhenUserIdIsZero() throws Exception {
        mockMvc.perform(get("/orders").param("userId", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void updatePayment_shouldFailForInvalidStatus() throws Exception {
        mockMvc.perform(patch("/order/1/payment").param("status", "INVALID"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
