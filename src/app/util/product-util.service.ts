import { Injectable } from '@angular/core';

@Injectable()
export class ProductUtilService {

    constructor() { }

    getProductClassification(product: any, index: number, products: any, page) {

        if (product.productClassification == 'P2') {
            return product.productClassification;
        }
        if (product.productClassification == 'P4') {
            return product.productClassification;
        }

        if (page == 'HOME') {
            if (product.productClassification == 'P1') {
                let count = products.length;
                if (count == 1) {
                   return "P3"; 
                }
                
                if (((count - 1) == index) && (products[index - 1].productClassification == "P2")) {
                    // If this is the last item and is an odd index.
                    return "P3";
                }

                if (((count - 1) == index) && ((index + 1) % 2 == 0)) {
                    return "P3";
                }

                if ((count - 1) > index && ((index) % 2 == 1)) {
                    // If next one is a P2 and is an odd index.
                    if (products[index + 1].productClassification == "P2") {
                        return "P3";
                    }
                }

                if (((count - 1) > index) && (index != 0)) {
                    // If its inbetween two P2s
                    if ((products[index + 1].productClassification == "P2")
                        && (products[index - 1].productClassification == "P2")) {
                        return "P3";
                    }
                }

                return product.productClassification;
            }
        } else {
            if (product.productClassification == 'P1') {
                let count = products.length;
                 if (count == 1) {
                   return "P3"; 
                }
                
                if (((count - 1) == index) && (products[index - 1].productClassification == "P2")) {
                    // If this is the last item and is an odd index.
                    return "P3";
                }

                if (((count - 1) == index) && ((index + 1) % 2 == 0)) {
                    return "P3";
                }

                if ((count - 1) > index && ((index) % 2 == 0)) {
                    // If next one is a P2 and is an odd index.
                    if (products[index + 1].productClassification == "P2") {
                        return "P3";
                    }
                }

                if (((count - 1) > index) && (index != 0)) {
                    // If its inbetween two P2s
                    if ((products[index + 1].productClassification == "P2")
                        && (products[index - 1].productClassification == "P2")) {
                        return "P3";
                    }
                }

                return product.productClassification;
            }
        }

        /*
        if(product.productClassification == 'P1'){
          let count = products.length;
          if(((count-1) == index) && (products[index-1].productClassification == "P2")){
            // If this is the last item and is an odd index.
            return "P3";
          } 
    
          if(((count-1) == index) && ((index+1) % 2 == 1)){
            return "P3";
          } 
          
          //tommarow test
          if((count-1) > index && ((index+1) % 2 == 1)){
            // If next one is a P2 and is an odd index.
            if(products[index+1].productClassification == "P2"){
              return "P3";
            }
          }
          // If not first item or last item
          if(((count-1) > index) && (index != 0)){
            // If its inbetween two P2s
            if((products[index+1].productClassification == "P2")
              && (products[index-1].productClassification == "P2")){
            return "P3";
            }
          }
          
          return product.productClassification;
    
        }*/
     
    }

    getPath(article_detail_display: string) {
        if (article_detail_display == 'C') {
            return "/article2";
        } else {
            return "/article";
        }
    }

    getArticleClassification(article: any, index: number, articles: any) {

        if (article.articleClassification == 'A2' || article.articleClassification == 'A3') {
            return article.articleClassification;
        }

        if (article.articleClassification == 'A1') {
            let count = articles.length;
            if (count == 1) {
                   return "A2"; 
            }
            if (((count - 1) == index) && (articles[index - 1].articleClassification == "A2" || articles[index - 1].articleClassification == "A3")) {
                // If this is the last item and is an odd index.
                return "A3";
            }

            if (((count - 1) == index) && ((index - 1) % 2 == 1)) {
                return "A3";
            }

            if ((count - 1) > index && ((index + 1) % 2 == 1)) {
                if (articles[index + 1].articleClassification == "A2" || articles[index + 1].articleClassification == "A3") {
                    return "A3";
                }
            }
            
            // If not first item or last item
            if (((count - 1) > index) && (index != 0)) {
                // If its inbetween two A2s
                if ((articles[index + 1].articleClassification == "A2" || articles[index + 1].articleClassification == "A3")
                    && (articles[index - 1].articleClassification == "A2" || articles[index - 1].articleClassification == "A3")) {
                    return "A3";
                }
            }

            return article.articleClassification;
        }
    }

    getProductBlockCount(productClassification, productIndexCount) {
        if (productClassification == "P2") {
            return productIndexCount + 2;
        }
        if (productClassification == "P1") {
            return productIndexCount + 1;
        }
        if (productClassification == "P3") {
            return productIndexCount + 2;
        }
        if (productClassification == "P4") {
            return productIndexCount + 2;
        }
    }

    getArticalBlockCount(articleClassification, articleIndexCount) {
        if (articleClassification == "A2") {
            return articleIndexCount + 2;
        }
        if (articleClassification == "A1") {
            return articleIndexCount + 1;
        }
        if (articleClassification == "A3") {
            return articleIndexCount + 2;
        }
    }

    classifyProducts(products){
        var rows = [];     
        for (var j = 0; j < products.length; j++) {
            if(products[j].productClassification == "P1"){
                if(j == 0){
                    var row = {rowType : "P1" ,spaceAvailable : true , products : [products[j]]};
                    rows.push(row);
                } else {
                    var previousRow = rows[rows.length - 1];
                   if(previousRow.spaceAvailable){
                        previousRow.products.push(products[j]);
                        previousRow.spaceAvailable = false;
                   } else {
                        var row = {rowType : "P1" ,spaceAvailable : true , products : [products[j]]};
                        rows.push(row);
                   }
                }
            } else {
                    var otherRow = {rowType : products[j].productClassification ,spaceAvailable : false , products : [products[j]]};
                    rows.push(otherRow);
            }
        }

        for (var j = 0; j < rows.length; j++) {
           if(rows[j].spaceAvailable){
            rows[j].products[0].productClassification = "P4"; 
           }
        }    

        
    }

    classifyArticles(articles){
        var rows = [];   
        console.log("Calling classifyArticles with articles " + articles.length); 
        
        for (var j = 0; j < articles.length; j++) {
            if(articles[j].articleClassification == "A1"){
                if(j == 0){
                    var row = {rowType : "A1" ,spaceAvailable : true , articles : [articles[j]]};
                    rows.push(row);
                } else {
                    var previousRow = rows[rows.length - 1];
                   if(previousRow.spaceAvailable){
                        previousRow.articles.push(articles[j]);
                        previousRow.spaceAvailable = false;
                   } else {
                        var row = {rowType : "A1" ,spaceAvailable : true , articles : [articles[j]]};
                        rows.push(row);
                   }
                }
            } else {
                    var otherRow = {rowType : articles[j].articleClassification ,spaceAvailable : false , articles : [articles[j]]};
                    rows.push(otherRow);
            }
        }

        for (var j = 0; j < rows.length; j++) {
           if(rows[j].spaceAvailable){
            rows[j].articles[0].articleClassification = "A2"; 
           }
        }    

        
    }
} 

