import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async insertProduct(title: string, desc: string, price: number) {
        const newProduct = new this.productModel({ 
            title: title,
            description: desc,
            price: price
        });
        const result = await newProduct.save();
        return result.id as string;
    }

    async getAllProducts() {
        const products = await this.productModel.find().exec();
        return products.map((prod) => { 
            id: prod.id; 
            title: prod.title; 
            description: prod.description; 
            price: prod.price});
    }

    async getSingleProduct(productId: string) {
        const product = await this.findProduct(productId);
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        };
    }

    async updateProduct(prodId: string, prodTitle: string, prodDesc: string, prodPrice: number) {
        const updatedProduct = await this.findProduct(prodId);
        if (prodTitle) updatedProduct.title = prodTitle;
        if (prodDesc) updatedProduct.description = prodDesc;
        if (prodPrice) updatedProduct.price = prodPrice;

        updatedProduct.save();
    }
    
    async deleteProduct(prodId: string) {
        const result = await this.productModel.deleteOne({_id: prodId}).exec();
        if (result.n === 0) throw new NotFoundException('Could not found product');
    }

    private async findProduct(id: string): Promise<Product> {
        let product;
        try { product = await this.productModel.findById(id); }
        catch (error) { throw new NotFoundException('Could not found product'); }
        if (!product) throw new NotFoundException('Could not found product');
        return product;
    }

}