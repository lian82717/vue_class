<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right">
            <button class="btn btn-primary mt-4" data-toggle="modal" @click="openModal(true)">建立新商品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">分類</th>
                    <th>產品名稱</th>
                    <th width="120" class="text-right">原價</th>
                    <th width="120" class="text-right">售價</th>
                    <th width="80">狀態</th>
                    <th width="80">編輯</th>
                    <th width="80">刪除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in products" :key="item.id">
                    <td>
                        {{item.category}}
                    </td>
                    <td>
                        {{item.title}}
                    </td>
                    <td class="text-right">
                        {{item.origin_price | currency}}
                    </td>
                    <td class="text-right">
                        {{item.price | currency}}
                    </td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" @click="delProduct(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :childPage="pagination"  @childChangeEvent="getProducts"/>
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="productModal" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>新增產品</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                            <label for="image">輸入圖片網址</label>
                            <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結" v-model="tempProduct.imgUrl">
                            </div>
                            <div class="form-group">
                            <label for="customFile">或 上傳圖片
                                <i class="fas fa-spinner fa-spin" v-if="status.uploading"></i>
                            </label>
                            <input type="file" id="customFile" class="form-control" ref="files" @change="uploadImg">
                            </div>
                            <img :src="tempProduct.imgUrl"
                            class="img-fluid" alt="">
                        </div>
                        <div class="col-sm-8">
                            <div class="form-group">
                                <label for="title">標題</label>
                                <input type="text" class="form-control" id="title" placeholder="請輸入標題" v-model="tempProduct.title">
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                        <label for="category">分類</label>
                                        <input type="text" class="form-control" id="category" placeholder="請輸入分類" v-model="tempProduct.category">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="price">單位</label>
                                    <input type="unit" class="form-control" id="unit" placeholder="請輸入單位" v-model="tempProduct.unit">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                <label for="origin_price">原價</label>
                                    <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價" v-model="tempProduct.origin_price">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="price">售價</label>
                                    <input type="number" class="form-control" id="price" placeholder="請輸入售價" v-model="tempProduct.price">
                                </div>
                            </div>
                            <hr>

                            <div class="form-group">
                                <label for="description">產品描述</label>
                                <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="content">說明內容</label>
                                <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                    id="is_enabled" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
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
                    <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
            aria-labelledby="delProductModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="delProductModal">
                        <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="isDel = false">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click="isDel = false">取消</button>
                        <button type="button" class="btn btn-danger" @click="updateProduct">確認刪除</button>
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
            products: [],
            tempProduct:{},
            isNew: false,
            isDel: false,
            isLoading: false,
            status: {
                uploading: false
            },
            pagination: {}
        }
    },
    components: {
        Pagination
    },
    methods: {
        getProducts( page = 1 ){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
            const vm = this;
            vm.isLoading = true;
            this.axios.get(api).then((res)=>{
                vm.products = res.data.products;
                vm.isLoading = false;
                vm.pagination = res.data.pagination;
            })
        },
        openModal( isNew,item ){
            if( isNew ){
                this.tempProduct = {};
                this.isNew = true;
            }else{
                this.tempProduct = Object.assign({},item);
                this.isNew = false;
            }
            $('#productModal').modal('show');
        },
        delProduct( item ){
            this.tempProduct = Object.assign({},item);
            $('#delProductModal').modal('show');
            this.isDel = true;
        },
        updateProduct( isDel ){
            this.isLoading = true;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
            let httpMethods = 'post';
            const vm = this;
            if( !vm.isNew ){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`,
                httpMethods = 'put'
            }
            if( vm.isDel ){
                httpMethods = 'delete';
            }
            this.axios[httpMethods](api, { data: vm.tempProduct} ).then((res)=>{
                if( res.data.success ){
                    $('#productModal').modal('hide');
                    $('#delProductModal').modal('hide');
                    vm.getProducts();
                    console.log(res.data);
                    vm.isDel = false;
                    vm.isLoading = false;
                    if( httpMethods === 'post' ){
                        this.$bus.$emit('message:push','新增成功','success');
                        this.isNew = false;
                    }else if( httpMethods === 'put'){
                        this.$bus.$emit('message:push','修改成功','success');
                    }else if( httpMethods === 'delete'){
                        this.$bus.$emit('message:push','刪除成功','success');
                        this.isDel = false;
                    }
                }else{
                    vm.getProducts();
                    this.$bus.$emit('message:push','修改失敗','danger');
                    vm.isLoading = false;
                }
            })
        },
        uploadImg(){
            const vm = this;
            const uploadedImg = this.$refs.files.files[0]
            const formData = new FormData;
            formData.append('file-to-upload',uploadedImg);
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
            vm.status.uploading = true;
            this.axios.post( api, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                if( res.data.success ){
                    vm.$set( vm.tempProduct, 'imgUrl', res.data.imageUrl )
                    vm.status.uploading = false;
                    this.$bus.$emit('message:push','上傳成功','success');
                    console.log(res.data);
                }else{
                    if( res.data.message !== '檔案格式錯誤' ){
                        this.$bus.$emit('message:push','檔案過大','danger');
                    }else{
                        this.$bus.$emit('message:push',res.data.message,'danger');
                    }
                }
            })
        },
    },
    created(){
        this.getProducts();
    }
}
</script>