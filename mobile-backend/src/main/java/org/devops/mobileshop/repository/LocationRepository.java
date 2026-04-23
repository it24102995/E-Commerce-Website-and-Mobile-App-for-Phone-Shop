package org.devops.mobileshop.repository;


import org.devops.mobileshop.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends MongoRepository<Location , String> {


    Location getLocationsByOrderId( String orderId );

    Optional<Location> findTopByOrderIdOrderByUpdatedTimeDesc( String orderId);


}
