<template>
    <div>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{ 'disabled' : !childPage.has_pre }">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="childChangePage(childPage.current_page - 1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="index in childPage.total_pages" :key="index" :class="{ 'active': childPage.current_page === index }">
                    <a class="page-link" href="#" @click.prevent="childChangePage(index)">
                        {{ index }}
                    </a>
                </li>
                <li class="page-item" :class="{ 'disabled' : !childPage.has_next }">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="childChangePage(childPage.current_page + 1)">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    props: ['childPage'],
    methods: {
        childChangePage(page){
            this.$emit('childChangeEvent',page)
        }
    }
}
</script>