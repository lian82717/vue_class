<template>
    <div>
	    <Loading :active.sync="isLoading"/>
        <div class="text-right">
            <button class="btn btn-primary mt-4" @click="openModal(true)">
                建立新的優惠券
            </button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>折扣百分比</th>
                    <th>到期日</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                    <th>刪除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in coupons" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.percent }}%</td>
                    <td>{{ item.due_date | date }}</td>
                    <td>
                        <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
                        <span v-else class="text-muted">未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" @click="delCoupon(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :childPage="pagination"  @childChangeEvent="getCoupons"/>
        <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="couponModal" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                        <span v-if="isNew">新增優惠券</span>
                        <span v-else>修改優惠券</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label for="title">標題</label>
                                <input type="text" class="form-control" id="title" placeholder="請輸入標題" v-model="tempCoupon.title">
                            </div>
                            <div class="form-group">
                                <label for="percent">折扣</label>
                                <input type="number" class="form-control" id="percent" placeholder="請輸入折扣" v-model.number="tempCoupon.percent">
                            </div>
                            <div class="form-group">
                                <label for="code">代碼</label>
                                <input type="code" class="form-control" id="code" placeholder="請輸入折價券代碼" v-model="tempCoupon.code">
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" :true-value="1" :false-value="0" id="is_enabled" v-model="tempCoupon.is_enabled">
                                    <label class="form-check-label" for="is_enabled">
                                        是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click="isNew = false">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delcouponModal" tabindex="-1" role="dialog"
            aria-labelledby="delcouponModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="delcouponModal">
                        <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="isDel = false">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click="isNew = false">取消</button>
                        <button type="button" class="btn btn-danger" @click="updateCoupon">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '../Pagination';

export default {
    data(){
        return {
            coupons: [],
            tempCoupon: {},
            isNew: false,
            isDel: false,
            pagination: {},
            isLoading: false
        }
    },
    components: {
        Pagination
    },
    methods: {
        getCoupons(){
			const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons`;
			const vm = this;
			vm.isLoading = true;
            this.axios.get(api).then((res)=>{
				vm.coupons = res.data.coupons;
				vm.pagination = res.data.pagination;
                vm.isLoading = false;
            })
        },
		openModal( isNew, item ){
            $('#couponModal').modal('show');
            if( isNew ){
                this.isNew = true;
            }else{
                this.isNew = false;
                this.tempCoupon = Object.assign({},item);
            }
        },
        delCoupon( item ){
            $('#delcouponModal').modal('show');
            this.isDel = true;
            this.tempCoupon = Object.assign({},item);
        },
        updateCoupon(){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            vm.tempCoupon.due_date = Math.floor(new Date() / 1000)
            let httpMethods = 'post'; //預設新增
            this.isLoading = true;
			$('#couponModal').modal('hide');
            $('#delcouponModal').modal('hide');
            if( vm.isNew ){
                this.axios[httpMethods](api,{ data: vm.tempCoupon }).then((res)=>{
                    vm.isLoading = false;
                    vm.isNew = false;
                    vm.getCoupons();
                })
            }else if( vm.isDel ){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                httpMethods = 'delete';
                this.axios[httpMethods](api).then((res)=>{
                    vm.isLoading = false;
                    vm.isDel = false;
                    vm.getCoupons();
                    console.log(res.data)
                })
            }
            else if( !vm.isNew ){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                httpMethods = 'put';
                this.axios[httpMethods](api,{ data: vm.tempCoupon }).then((res)=>{
                    vm.isLoading = false;
                    vm.getCoupons();
                })
            }
        }
    },
    created(){
        this.getCoupons();
    }
}
</script>