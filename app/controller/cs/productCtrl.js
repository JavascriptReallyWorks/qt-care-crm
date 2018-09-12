
let mongoose = require('mongoose'); //var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');

module.exports = app => {
    class ProductController extends app.Controller {
        async  saveAndUpdateProduct(){
            const rule = {
                product:'object',
            };
            this.ctx.validate(rule);

            let {product} = this.req.body;
            if(!product.sid)
                product.sid = await this.ctx.helper.getNextSid('product');

            let data = await this.ctx.model.Product.findOneAndUpdate({sid:product.sid}, {$set:product},{upsert:true, new:true});
            if(data)
                this.checkStatusAndRespond({status:'ok'});
            else
                this.checkStatusAndRespond({status:'no'});
        }

        async  findOneProduct(){
            let id = this.ctx.query.id;
            if(id){
                let data = await this.ctx.model.Product.findById(id);
                this.checkAndRespond(data);
            }
        }

        async  queryProductByCond(){
            const rule = {
                page:'int',
                limit:'int'
            };
            this.ctx.validate(rule);

            const {page, limit, cond} = this.req.body;
            for (let i in cond) {
                cond[i] = new RegExp(cond[i], "ig");
            }
            let data = await this.csService.queryProducts(cond,page,limit);
            this.checkAndRespond(data);
        }

        async queryProductList(){
            let data = await this.ctx.model.Product.find({},{
                product_name:1,
                sid:1,
                unit_price:1,
            });
            this.checkAndRespond(data);

        }

        async  deleteProductById(){
            const rule = {
                id:'string',
            };
            this.ctx.validate(rule);
            const {id} = this.req.body;
            try{
                await this.ctx.model.Product.findByIdAndRemove(id);
                this.checkStatusAndRespond({status:'ok'});
            }
            catch(err){
                this.checkStatusAndRespond({status:'no'});
                throw err;
            }

        }
    }
    return ProductController;
};