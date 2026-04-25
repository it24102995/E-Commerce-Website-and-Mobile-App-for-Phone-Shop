package org.devops.mobileshop.controller;


import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.OrderDto;
import org.devops.mobileshop.dto.OrderResponseDto;
import org.devops.mobileshop.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor

@CrossOrigin("*")
public class OrderController {


    private final OrderService orderService;




    @PostMapping


     public OrderDto placeOrder(@RequestBody OrderDto orderDto){

        return  orderService.createOrder(orderDto);





    }


    @GetMapping("/user")
    public List<OrderResponseDto>
 getOrdersByUserId( @RequestParam
                     String userId) {
        return orderService.getOrderByUserId(userId);
    }

    @GetMapping
    public List<OrderResponseDto> getAllOrders( ) {

        return  orderService.getAllOrders()
                ;
    }

    @PostMapping("/accept-order/{orderId}/{deliverId}")

    public List<OrderResponseDto> accpetOrder(@PathVariable String deliverId , @PathVariable String orderId)

    {


         return orderService.acceptOrder(deliverId, orderId);




    }

    @GetMapping("/{deliverId}")

    public  List<OrderResponseDto> getAllOrdersByDeliverId(  @PathVariable String  deliverId) {



         return orderService.getAllOrdersByDeliverId( deliverId);
    }
}
