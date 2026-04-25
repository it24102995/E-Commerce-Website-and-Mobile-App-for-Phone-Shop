package org.devops.mobileshop.repository;


import org.devops.mobileshop.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

      Order findOrderByIdOrderByUserId( String id ) ;
      Order findOrderById( String id ) ;

      List<Order> findOrderByUserId( String userId);





      List<Order> findOrdersByIdIn( List<String> ids ) ;

      List<Order> findOrdersByDeliverId( String  id ) ;



      @Override
      List<Order> findAll();
}
