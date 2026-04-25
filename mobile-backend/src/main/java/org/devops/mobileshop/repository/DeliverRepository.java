package org.devops.mobileshop.repository;


import org.devops.mobileshop.model.Deliver;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DeliverRepository  extends MongoRepository<Deliver, String> {




    Deliver findDeliverById( String id );

    Deliver findDeliverByEmail( String email) ;

    @Override
    List<Deliver> findAll();


}
