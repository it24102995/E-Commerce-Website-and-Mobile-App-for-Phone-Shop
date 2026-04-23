    package org.devops.mobileshop.model;


    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.bson.codecs.pojo.annotations.BsonId;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.mapping.Document;

    @Document( collection = "products")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor

    public class Product {




        @Id
        private String id ;





        private String  model ;

        private double price ;
        private int quantity ;
        private  int stock ;
        private String description ;
        private String image ;



    }
