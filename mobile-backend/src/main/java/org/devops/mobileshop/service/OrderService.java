package org.devops.mobileshop.service;


import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.OrderDto;
import org.devops.mobileshop.dto.OrderResponseDto;
import org.devops.mobileshop.exception.UserNotFoundException;
import org.devops.mobileshop.model.Deliver;
import org.devops.mobileshop.model.Order;
import org.devops.mobileshop.repository.DeliverRepository;
import org.devops.mobileshop.repository.OrderRepository;
import org.devops.mobileshop.repository.ProductsRepository;
import org.devops.mobileshop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class OrderService {

     private final OrderRepository orderRepository;

     private final DeliverRepository deliverRepository;



      private final UserRepository userRepository;

      private final ProductsRepository productsRepository;



        public OrderDto createOrder( OrderDto orderDto) {



              var createdOrder = new Order();

               // getting the user via id

             var user = userRepository.findUserById(orderDto.customerId())



;


             if( user == null) {
                 throw new UserNotFoundException("user not found ");

             }




              //var  productList =  productsRepository.findProductsByIdIn(orderDto.productIds())



             //var product = productsRepository.findById(orderDto.productIds());

              var shippingAddress = orderDto.shippingAddress();
              var billingAddress = orderDto.billingAddress();



              createdOrder.setUser(user);
              createdOrder.setStatus("PENDING");
              createdOrder.setProductList(productsRepository.findProductByIdIn(orderDto.ids()));
              createdOrder.setShippingAddress(shippingAddress);
              createdOrder.setBillingAddress(billingAddress);
              createdOrder.setDeliver( null);






              // sacing the order to the database
              orderRepository.insert(createdOrder);





                return new OrderDto(user.getName() ,user.getId(), shippingAddress, billingAddress ,orderDto.ids());





        }



        public List<OrderResponseDto> getAllOrders() {



              return   orderRepository.findAll().stream().map( order -> new OrderResponseDto(
                      order.getId(),
                      order.getStatus(),

                      order.getUser().getName(),
                      order.getUser().getId(),
                      order.getShippingAddress(),
                      order.getBillingAddress(),
                      order.getProductList()


              )).toList();
        }


        public List<OrderResponseDto> getOrderByUserId ( String  userId) {


            var  orders = orderRepository.findOrderByUserId(userId);
            if(orders.isEmpty()){
                 throw    new RuntimeException("No orders found");
            }
            return orders.stream().map(order ->  new OrderResponseDto(
                    order.getId(),
                    order.getStatus(),
                    order.getUser().getName(),
                    order.getUser().getId(),
                    order.getShippingAddress(),
                    order.getBillingAddress(),
                    order.getProductList()


            )).collect(Collectors.toList());
        }


        public List<OrderResponseDto> acceptOrder(String deliverId , String orderIds) {

             //var orders = orderRepository.findOrdersByIdIn(orderIds);
            var orders = orderRepository.findOrderById(orderIds)
;


            var  deliver =  deliverRepository.findDeliverById( deliverId);
            if( deliver == null) {

               throw new UserNotFoundException("user not  found  with the id " + deliverId);

            }
            updateOrderStatus(orders, deliver);
orderRepository.save(orders);



            var acceptedOrders = orderRepository.findOrdersByDeliverId(deliverId);

            return acceptedOrders.stream().map( order -> new OrderResponseDto(
                    order.getId(),
                    order.getStatus(),
                    order.getUser().getName(),
                    order.getUser().getId(),
                    order.getShippingAddress(),
                    order.getBillingAddress(),
                    order.getProductList()


            )).collect(Collectors.toList());




















































        }

         private void updateOrderStatus(Order orderList , Deliver deliver
         ){





                orderList.setStatus("OUT FOR DELIVER");
                orderList.setDeliver(deliver);

         }


         public  List<OrderResponseDto> getAllOrdersByDeliverId ( String id ) {

            var deliver = deliverRepository.findDeliverById(id);
            if( deliver == null){
                throw    new UserNotFoundException("Deliver Not Found ") ;

            }



            return orderRepository.findOrdersByDeliverId(id).stream().map(order ->  new OrderResponseDto(order.getId(),  order.getStatus(), order.getUser().getName(),
                    order.getUser().getId(),
                    order.getShippingAddress(),
                    order.getBillingAddress(),
                    order.getProductList()

                    ))

                    .collect(Collectors.toList());
         }





}
