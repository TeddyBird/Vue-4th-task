export default{
    props:["pages"],
    template:`<nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class = "{disabled:!pages.has_pre}" @click = changePage("prev")>
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item"
            :class = "{active: pages.current_page === page}"
            v-for="(page,index) in pages.total_pages" :key = "page + 'page'">
                <a class="page-link" href="#" @click = "$emit('get-page',page)">{{page}}</a>
            </li>
            <li class="page-item" :class = "{disabled:!pages.has_next}" @click = changePage("next")>
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>`,
    methods: {
        changePage(move){
            if(move === "next"){
                this.$emit("get-page",this.pages.current_page + 1);
            }else if(move === "prev"){
                this.$emit("get-page",this.pages.current_page - 1);
            }
        },
    },
}