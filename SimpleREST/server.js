    var express = require('express')
      , app = express.createServer()
      , mongoose = require('mongoose');

    mongoose.connect('mongodb://127.0.0.1/ProductDB');
	
	//Models using Mongoose
    var Schema = mongoose.Schema
      , ObjectId = Schema.ObjectID;

    var Product = new Schema({
         name          : { type: String, required: true, trim: true }
		,unitPrice	   : { type: Number, required: true }
		,itemsInStock  : { type: Number, required: true }
    });	
	
    var Category = new Schema({
        name      		: { type: String, required: true, trim: true }
      , description    :  { type: String, required: true, trim: true }  
      , products         : [Product] 	  
    });	
	
    var ProductCatalog = mongoose.model('Category', Category);
     //Get all product catalog 
    app.get('/', function(req,res){	
        ProductCatalog.find({}, function(error, data){
            res.json(data);
        });
    });
	//Get a specified category
	app.get('/:name', function(req,res){	
        ProductCatalog.findOne({ name: req.params.name }, function(error, category){
            if(error){
                res.json(error);
            }
            else if(category == null){
                res.json('no such category!')
            }
            else{
				res.json(category);	
			}
		});	
    });
	
	//Add category
    app.get('/addcategory/:name/:description', function(req, res){
        var category_data = {
            name: req.params.name
          , description: req.params.description         
        };

        var category = new ProductCatalog(category_data);

        category.save( function(error, data){
            if(error){
                res.json(error);
            }
            else{
                res.json(data);
            }
        });
    });
	//Add product to a category
    app.get('/addproduct/:category/:name/:unitPrice/:itemsInStock', function(req, res){
        ProductCatalog.findOne({ name: req.params.category }, function(error, category){
            if(error){
                res.json(error);
            }
            else if(category == null){
                res.json('no such category!')
            }
            else{
                category.products.push({ name: req.params.name, unitPrice: req.params.unitPrice,itemsInStock: req.params.itemsInStock });
                category.save( function(error, data){
                    if(error){
                        res.json(error);
                    }
                    else{
                        res.json(data);
                    }
                });
            }
        });
    });

    app.listen(8000);
    console.log("listening on port %d", app.address().port);