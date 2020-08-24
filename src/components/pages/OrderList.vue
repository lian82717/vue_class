<template>
	<div>
		<Loading :active.sync="isLoading"/>
		<table class="table mt-4">
			<thead>
				<tr>
					<th>購買時間</th>
					<th>Email</th>
					<th>購買款項</th>
					<th class="text-right">應付金額</th>
					<th class="text-right">是否付款</th>
					<th>編輯</th>
					<th>刪除</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in sortOrder" :key="item.id" :class="{'text-secondary': !item.is_paid}">
					<td>{{ item.create_at | date }}</td>
					<td>{{ item.user.email}}</td>
					<td>
						<ul class="list-unstyled">
							<li v-for="(product, i) in item.products" :key="i">
								{{ product.title }} 數量：{{ product.qty }}
								{{ product.unit }}
							</li>
						</ul>
					</td>
					<td class="text-right">{{ item.total | currency }}</td>
					<td class="text-right">
						<strong v-if="item.is_paid" class="text-success">已付款</strong>
            			<span v-else class="text-muted">尚未付款</span>
					</td>
					<td>
						<button class="btn btn-outline-primary btn-sm" @click="openModal">編輯</button>
					</td>
					<td>
						<button class="btn btn-danger btn-sm" @click="delOrder">刪除</button>
					</td>
				</tr>
			</tbody>
		</table>
        <Pagination :childPage="pagination"  @childChangeEvent="getOrders"/>
        <div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="orderModal" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>修改訂單</span>
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
                                <input type="text" class="form-control" id="title" placeholder="請輸入標題">
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                        <label for="category">分類</label>
                                        <input type="text" class="form-control" id="category" placeholder="請輸入分類">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="price">單位</label>
                                    <input type="unit" class="form-control" id="unit" placeholder="請輸入單位">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                <label for="origin_price">原價</label>
                                    <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="price">售價</label>
                                    <input type="number" class="form-control" id="price" placeholder="請輸入售價">
                                </div>
                            </div>
                            <hr>

                            <div class="form-group">
                                <label for="description">產品描述</label>
                                <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="content">說明內容</label>
                                <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容"></textarea>
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="is_enabled">
                                    <label class="form-check-label" for="is_enabled">
                                    	是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary">確認</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delOrderModal" tabindex="-1" role="dialog"
            aria-labelledby="delOrderModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="delOrderModal">
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
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click="isDel = false">取消</button>
                        <button type="button" class="btn btn-danger">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
import $ from "jquery";
import Pagination from "../Pagination";

export default {
	data() {
		return {
			orders: [
			{
				"create_at": 1523532324,
				"id": "-L9u2EUkQsdsmdfgdfg3LF",
				"is_paid": false,
				"message": "這是留言",
				"paid_date": 1523539924,
				"payment_method": "credit_card",
				"products": {
						"L8nBrq8Ydm4ARI1Kog4t": {
							"id": "L8nBrq8Ym4ARI1Kog4t",
							"product_id": "-L8moRfPlDZZ2e-1ritQ",
							"title": "商品2",
							"qty": "3",
							"unit": "個"
						},
						"L8nBrqff8Ym4fdfs1Kog4t": {
							"id": "L8nBrq8Ym4ARI1Kog4t",
							"product_id": "-L8moRfPlDZZ2e-1ritQ",
							"title": "商品3",
							"qty": "5",
							"unit": "個"
						},
						"L8nBrq8Ymggddss1Kog4t": {
							"id": "L8nBrq8Ym4ARI1Kog4t",
							"product_id": "-L8moRfPlDZZ2e-1ritQ",
							"title": "商品4",
							"qty": "30",
							"unit": "個"
						}
				},
				"total": 100,
				"user": {
					"address": "kaohsiung",
					"email": "test@gmail.com",
					"name": "test",
					"tel": "0912346768"
				},
				"num": 1
			},
			{
				"create_at": 1523539834,
				"id": "-L9u2EUkQSoEmW7QzGLF",
				"is_paid": true,
				"message": "這是留言",
				"paid_date": 1523539924,
				"payment_method": "credit_card",
				"products": {
						"L8nBrq8Ym4ARI1Kog4t": {
							"id": "L8nBrq8Ym4ARI1Kog4t",
							"product_id": "-L8moRfPlDZZ2e-1ritQ",
							"title": "商品1",
							"qty": "3",
							"unit": "個"
						}
				},
				"total": 51100,
				"user": {
					"address": "kaohsiung",
					"email": "test@gmail.com",
					"name": "test",
					"tel": "0912346768"
				},
				"num": 1
			},
			{
				"create_at": 1523539834,
				"id": "-L9u2EUkQSoEmdfgdfg3LF",
				"is_paid": true,
				"message": "這是留言",
				"paid_date": 1523539924,
				"payment_method": "credit_card",
				"products": {
						"L8nBrq8Ym4ARI1Kog4t": {
							"id": "L8nBrq8Ym4ARI1Kog4t",
							"product_id": "-L8moRfPlDZZ2e-1ritQ",
							"title": "商品2",
							"qty": "3",
							"unit": "個"
						},
						"L8nBrq8Ym4fdfs1Kog4t": {
							"id": "L8nBrq8Ym4ARI1Kog4t",
							"product_id": "-L8moRfPlDZZ2e-1ritQ",
							"title": "商品3",
							"qty": "5",
							"unit": "個"
						},
						"L8nBrq8Ymddss1Kog4t": {
							"id": "L8nBrq8Ym4ARI1Kog4t",
							"product_id": "-L8moRfPlDZZ2e-1ritQ",
							"title": "商品4",
							"qty": "30",
							"unit": "個"
						}
				},
				"total": 100,
				"user": {
					"address": "kaohsiung",
					"email": "test@gmail.com",
					"name": "test",
					"tel": "0912346768"
				},
				"num": 1
			}],
			isNew: false,
			isDel: false,
			pagination: {},
			isLoading: false,
			tempOrder: {
				
			}
		};
	},
	components: {
		Pagination,
	},
	methods: {
		getOrders( page = 1 ){
			const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
			const vm = this;
			vm.isLoading = true;
            this.axios.get(api).then((res)=>{
				// vm.orders = res.data.orders;
				vm.pagination = res.data.pagination;
				vm.isLoading = false;
				console.log(api)
				console.log(res.data)
            })
		},
		openModal(){
			$('#orderModal').modal('show');
		},
        delOrder(){
            $('#delOrderModal').modal('show');
            this.isDel = true;
		},
		updatedOrder(){
			let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
			const vm = this;

		}
		
	},
	computed: {
		sortOrder() {
			const vm = this;
			let newOrder = [];
			if (vm.orders.length) {
				newOrder = vm.orders.sort((a, b) => {
					const aIsPaid = a.is_paid ? 1 : 0;
					const bIsPaid = b.is_paid ? 1 : 0;
					return bIsPaid - aIsPaid;
				});
			}
			return newOrder;
		},
	},
	created(){
		this.getOrders();
	}
};
</script>