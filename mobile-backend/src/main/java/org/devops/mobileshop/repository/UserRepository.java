package org.devops.mobileshop.repository;


import org.devops.mobileshop.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User , String> {




    User findUserById(  String id ) ;

    User findUserByUsername( String email) ;

    User findUserByEmail( String email );







}
