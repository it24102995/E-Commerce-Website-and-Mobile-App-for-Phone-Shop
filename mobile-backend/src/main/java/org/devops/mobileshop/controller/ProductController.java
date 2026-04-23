package org.devops.mobileshop.controller;


import lombok.RequiredArgsConstructor;
import org.devops.mobileshop.dto.ProductDto;
//import org.devops.mobileshop.repository.ProductsRepository;
import org.devops.mobileshop.dto.ProductIdDto;
import org.devops.mobileshop.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product"
)
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {





    private final ProductService productService;



    @GetMapping
    public List<ProductDto> getAllProducts( ){

        return productService.getAllProducts();


    }


    @GetMapping("/products")
    public List<ProductDto> getAllProductByProductIds( @RequestParam List<String> productIds) {



        return productService.getAllProductsByIds( productIds);
    }


    @PostMapping

    public ProductDto createProduct(@RequestBody  ProductDto productDto) {


        return productService.createProduct(productDto);

    }




}
