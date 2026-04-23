package org.devops.mobileshop.service;


import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.ProductDto;
import org.devops.mobileshop.dto.ProductIdDto;
import org.devops.mobileshop.model.Product;
import org.devops.mobileshop.repository.ProductsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

@RequiredArgsConstructor

public class ProductService {

    private final ProductsRepository productsRepository;

    public ProductDto createProduct( ProductDto productDto) {



        var product = new Product();


        product.setDescription(productDto.description());

        product.setPrice(productDto.price());
        product.setModel(productDto.model());

product.setImage(productDto.image());
    product.setStock(productDto.stock());


 productsRepository.save( product);


 return new ProductDto(product.getId(), product.getModel(),product.getPrice(),product.getQuantity()
 ,product.getDescription(), product.getStock(), product.getImage())
;

    }


    public List<ProductDto> getAllProductsByIds( List<String> ids) {




        return productsRepository.findProductByIdIn(ids)
                .stream().map(

                        product -> new ProductDto(

                                product.getId(),
                                product.getModel(),
                                product.getPrice(),
                                product.getQuantity(),
                                product.getDescription(),
                                product.getStock(),
                                product.getImage()

                )).collect(Collectors.toList());
    }






    public List<ProductDto> getAllProducts() {


        return productsRepository.findAll().stream().map( product -> new ProductDto(product.getId(), product.getModel(),
                product.getPrice(),
                product.getQuantity(),product.getDescription() , product.getStock(), product.getImage())).collect(Collectors.toList());
    }
}
