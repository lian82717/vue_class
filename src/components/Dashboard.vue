<template>
    <div>
        <Navbar/>
        <Alert/>
        <div class="container-fluid">
            <div class="row">
                <Sidebar/>
                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <router-view/>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Alert from './Alert';

export default {
    components: {
        Navbar,
        Sidebar,
        Alert
    }    
}
</script>