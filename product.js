import {createApp} from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
import pagination from "./page.js";

let productModal = "";
let delProductModal = "";

const app = createApp({
    data(){
        return{
            apiUrl:"https://vue3-course-api.hexschool.io/v2",
            apiPath: "tedbirdy",
            products:[],
            pagination:"",
            currentProduct:{
            // title: "",
            // category: "",
            // origin_price: "",
            // price: "",
            // unit: "",
            // description:"",
            // content: "",
            // is_enabled: 1,
            // imageUrl: "",
            // imagesUrl:[],
            },
            action:"",
        }
    },

    components:{
    pagination,
    },
    methods: {
    //檢查登入
    checkLog(){
        const url = `${this.apiUrl}/api/user/check`;
        axios.post(url)
            .then(() => {
                this.getData();
            })
            .catch((err) => {
                alert(err.data.message);
                location.href = "index.html";
            })
    },

    //取得產品資料
    getData(page = 1){
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
        axios.get(url)
        .then(res => {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
        })
    },

    //開關產品詳情跳窗
    toggleProductModal(action){
        if(action === "create"){
        this.currentProduct = {};
        productModal.show();
        this.action = "create";
        }else if(action === "update"){
        productModal.show();
        this.action = "update";
        }else{
        this.currentProduct = {};
        this.action = "";
        productModal.hide();
        }
    },

    //開關刪除產品跳窗
    toggledelProductModal(item,action){
        if(action === "delete"){
        this.currentProduct =  JSON.parse(JSON.stringify(item));
        delProductModal.show();
        }else{
        this.currentProduct = {};
        delProductModal.hide();
        }
    },

    //打開編輯產品
    clickUpdateButton(item){
        this.currentProduct = JSON.parse(JSON.stringify(item));
    },
    },

    mounted() {
    productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkLog();

    },
});


//產品新增修改元件
app.component("productModal",{
    template: "#productModalTemplate",
    props:["currentProduct","action","pagination"],
    data(){
        return{
        apiUrl:"https://vue3-course-api.hexschool.io/v2",
        apiPath: "tedbirdy",
        }
    },
    methods:{
        // 開關產品詳情跳窗
        toggleProductModal(action){
        if(action === "create"){
            productModal.show();
        }else if(action === "update"){
            productModal.show();
        }else{
            productModal.hide();
        }
        },
        //新增產品
        createProduct(){
        const productInfo = {"data": this.currentProduct};
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;

        axios.post(url,productInfo)
            .then((res)=>{
            alert(res.data.message);
            this.toggleProductModal('close');
            // this.getData();
            this.$emit("get-data");
            })
            .catch((err) => {
            alert(err.data.message);
            })
        },

        //編輯商品
        updateProduct(){
        const productInfo = {"data": this.currentProduct};
        const id = this.currentProduct.id;
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`;

        axios.put(url,productInfo)
            .then((res)=>{
            alert(res.data.message);
            this.toggleProductModal('close');
            // this.getData();
            this.$emit("get-data",this.pagination.current_page);
            })
            .catch((err)=>{
            alert(err.data.message);
            })
        },

        //新增產品圖片
        addImage(){
        if(this.currentProduct.imagesUrl === undefined){
            this.currentProduct.imagesUrl = [];
            this.currentProduct.imagesUrl.push("");
        }else{
            this.currentProduct.imagesUrl.push("");
        }
        },

        //刪除產品圖片
        removeImage(){
        this.currentProduct.imagesUrl.pop();
        },
    },

    mounted(){
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    },
});

//產品刪除元件
app.component("delProductModal",{
    template:"#delProductModalTemplate",
    props:["currentProduct","action","pagination"],
    data(){
        return{
            apiUrl:"https://vue3-course-api.hexschool.io/v2",
            apiPath: "tedbirdy",
        }
    },
    methods:{
    //開關刪除產品跳窗
    toggledelProductModal(item,action){
        if(action === "delete"){
            delProductModal.show();
        }else{
            delProductModal.hide();
        }
    },
    //刪除產品
    deleteProduct(){
        const id = this.currentProduct.id;
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`;

        axios.delete(url)
        .then((res)=>{
            alert(res.data.message);
            this.toggledelProductModal('','close');
            // this.getData();
            this.$emit("get-data",this.pagination.current_page);
        })
        .catch((err)=>{
            alert(err.data.message);
        })
    },
    },
    mounted(){
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
    },
});

app.mount("#app");