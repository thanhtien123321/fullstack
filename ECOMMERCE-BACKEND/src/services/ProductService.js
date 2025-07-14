const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {

    return new Promise(async (resolve, reject) => {

        
        const { name , image , type , price ,  countInStock , rating , description} = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name 
            })
            if(checkProduct != null){
                resolve({
                    status : 'ok',
                    message : 'the name of product is already',

                })
            }
            
            const newProduct = await Product.create({
                name , image , type , price ,  countInStock , rating , description

            })
            if(newProduct){
            resolve({
                status : 'ok',
                message: 'success',
                data : newProduct,
                
            });
            }

        } catch (e) {
            reject(e);
        }
    });
};


const updateProduct = (id , data) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const checkProduct = await Product.findById(id);
            console.log('checkProduct' , checkProduct)
            if (checkProduct === null) {
                return resolve({
                    status: 'error',
                    message: 'The product is not defined',
                });
            }
 
            const updateProduct = await Product.findByIdAndUpdate(id , data , {new:true})
            console.log('updateProduct' , updateProduct)

            return resolve({
                status: 'ok',
                message: 'Success',
                data : updateProduct
                
                
            });

        } catch (e) {
            reject(e);
        }
    });
};


const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const checkProduct = await Product.findById(id);
            
            if (checkProduct === null) {
                return resolve({
                    status: 'error',
                    message: 'The Product is not defined',
                });
            }
 
            await Product.findByIdAndDelete(id)
            
            return resolve({
                status: 'ok',
                message: 'delete Product Success',
                
                
                
            });

        } catch (e) {
            reject(e);
        }
    });
};
const deleteManyProduct = (ids ) => {
    
    return new Promise(async (resolve, reject) => {
        
        try {
            await Product.deleteMany({_id : { $in : ids }})
            return resolve({
                status: 'ok',
                message: 'delete Product Success',
            
            });

        } catch (e) {
            reject(e);
        }
    });
};
const getAllProduct = (limit, page, sort, filter = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const query = {};
  
        if (filter.name) {
          query.name = { $regex: filter.name, $options: 'i' };
        }
  
        if (filter.type) {
          query.type = { $regex: filter.type, $options: 'i' };
        }
  
        const totalProduct = await Product.countDocuments(query);
  
        const objectSort = typeof sort === 'string'
          ? { name: sort === 'desc' ? -1 : 1 }
          : typeof sort === 'object'
          ? { [sort[1]]: sort[0] }
          : {};
  
        const allProducts = await Product.find(query)
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
  
        resolve({
          status: 'ok',
          message: 'Success',
          data: allProducts,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit)
        });
      } catch (e) {
        reject(e);
      }
    });
  };
  
const getDetailsProduct = (id ) => {
    return new Promise(async (resolve, reject) => {
        
        try {
            const product = await Product.findById(id); 
            if (product === null) {
                return resolve({
                    status: 'error',
                    message: 'The product is not defined',
                });
            }
            return resolve({
                status: 'ok',
                message: 'success',
                data : product
                
                
                
            });

        } catch (e) {
            reject(e);
        }
    });
};

const getAllType = () => {   
    return new Promise(async (resolve, reject) => {     
        try {
  
            const allType = await Product.distinct('type')
            resolve({
                status: 'ok',
                message: 'Success',
                data : allType
            })
        } catch (e){
            reject(e);
        }
    }
    )
}
            
            

            
module.exports = {
   createProduct,
   updateProduct,
   getDetailsProduct,
   deleteProduct,
   getAllProduct,
   getAllType,
   deleteManyProduct
};
