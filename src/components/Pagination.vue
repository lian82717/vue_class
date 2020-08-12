<template>
    <div>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <!-- <li class="page-item" :class="{ 'disabled' : !childPage.has_pre }">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="index in childPage.total_pages" :key="index" :class="{ 'active': childPage.current_page === index }">
                    <a class="page-link" href="#">
                        {{ index }}
                    </a>
                </li>
                <li class="page-item" :class="{ 'disabled' : !childPage.has_next }">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li> -->
                {{ childPage }}
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    prors: ['childPage']
}
</script>