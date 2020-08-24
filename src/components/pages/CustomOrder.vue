<template>
    <div>
		<Loading :active.sync="isLoading"/>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
            <div class="card border-0 shadow-sm">
                <div style="height: 300px; background-size: cover; background-position: center" :style="{ backgroundImage: `url(${item.imgUrl})`}"></div>
                <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{ item.title }}</a>
                    </h5>
                    <p class="card-text">{{ item.content }}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="!item.price">{{ item.origin_price | currency }} 元</div>
                        <del class="h6" v-if="item.price">原價 {{ item.origin_price | currency }} 元</del>
                        <div class="h5" v-if="item.price">現在只要 {{ item.price | currency }} 元</div>
                    </div>
                </div>
                <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getSingelProduct( item.id )">
                        <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingMore"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addToCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingCart"></i>
                        加到購物車
                    </button>
                </div>
            </div>
            </div>
        </div>
        <table class="table">
            <thead>
                <th></th>
                <th>品名</th>
                <th>數量</th>
                <th>單價</th>
            </thead>
            <tbody>
                <tr v-for="item in cart.carts" :key="item.id">
                <td class="align-middle">
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCart(item.id)">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </td>
                <td class="align-middle">
                    {{ item.product.title }}
                    <!-- <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                    </div> -->
                </td>
                <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.final_total }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right">總計</td>
                    <td class="text-right">{{ cart.total }}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                    <td colspan="3" class="text-right text-success">折扣價</td>
                    <td class="text-right text-success">{{ cart.final_total }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                    套用優惠碼
                </button>
            </div>
        </div>
        <Pagination :childPage="pagination"  @childChangeEvent="getProducts"/>

        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ singleProduct.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="singleProduct.imgUrl" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                        <p class="mb-0">{{ singleProduct.content }}</p>
                        <footer class="blockquote-footer text-right">{{ singleProduct.description }}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h4" v-if="!singleProduct.price">{{ singleProduct.origin_price }} 元</div>
                        <del class="h6" v-if="singleProduct.price">原價 {{ singleProduct.origin_price }} 元</del>
                        <div class="h4" v-if="singleProduct.price">現在只要 {{ singleProduct.price }} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="singleProduct.num">
                        <option :value="num" v-for="num in 10" :key="num">
                            選購 {{num}} {{singleProduct.unit}}
                        </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                        小計 <strong>{{ singleProduct.num * singleProduct.price }}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary" @click="addToCart(singleProduct.id, singleProduct.num)">
                            <i class="fas fa-spinner fa-spin" v-if="singleProduct.id === status.loadingCart"></i>
                            加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import Pagination from "../Pagination";

export default {
    data(){
        return{
            products: [],
            singleProduct:{},
            pagination: {},
            isLoading: false,
            status: {
                loadingMore: '',
                loadingCart: ''
            },
            cart: {},
            coupon_code: ''
        }
    },
    components: {
		Pagination,
	},
    methods: {
        getProducts( page = 1 ){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
            vm.isLoading = true;
            this.axios.get(api).then((res)=>{
                vm.products = res.data.products;
                vm.pagination = res.data.pagination;
                vm.isLoading = false;
            })
        },
        getSingelProduct( id ){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
            vm.status.loadingMore = id;
            this.axios.get(api).then((res)=>{
                vm.singleProduct = res.data.product;
                vm.status.loadingMore = '';
                $('#productModal').modal('show');
            })
        },
        addToCart( id, qty = 1 ){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            vm.status.loadingCart = id;
            const cart = {
                product_id : id,
                qty
            }
            this.axios.post(api,{ data: cart }).then((res)=>{
                console.log(res.data)
                vm.status.loadingCart = '';
                $('#productModal').modal('hide');
                vm.getCart();
            })
        },
        removeCart( id ) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`
            vm.isLoading = true;
            this.axios.delete(api).then((res)=>{
                console.log(res.data);
                vm.getCart();
                vm.isLoading = false;
            })
        },
        getCart() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            vm.isLoading = true;
            this.axios.get(api).then((res)=>{
                console.log(res.data);
                vm.cart = res.data.data;
                vm.isLoading = false;
            })
        },
        addCouponCode() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
            const coupon = {
                code: vm.coupon_code
            }
            vm.isLoading = true;
            this.axios.post(api,{data: coupon}).then((res)=>{
                console.log(res.data);
                vm.getCart();
                vm.isLoading = false;
            })
        }
    },
    created(){
        this.getProducts();
        this.getCart();
    }
}
</script>