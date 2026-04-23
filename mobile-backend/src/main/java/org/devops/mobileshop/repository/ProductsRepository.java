package org.devops.mobileshop.repository;


import org.devops.mobileshop.model.Product;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.data.domain.Example;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface ProductsRepository extends MongoRepository<Product, String> {





    List<Product> findProductByIdIn( List<String>  ids  );








}
