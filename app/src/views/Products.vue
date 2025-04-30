<template>
 <v-container>
   <v-row align="center" class="mb-4">
     <v-col cols="auto">
       <v-img src="/logo.png" alt="VolksVegan Logo" width="100" height="100" contain></v-img>
     </v-col>
   </v-row>

   <v-text-field
     v-model="searchQuery"
     label="Produkte suchen"
     prepend-inner-icon="mdi-magnify"
     clearable
     class="mb-4"
   />

   <v-row>
     <v-col
       v-for="product in filteredProducts"
       :key="product.id"
       cols="12"
       sm="6"
       md="4"
     >
       <v-card>
        <v-card-title>{{ product.title }}</v-card-title>
        <v-card-subtitle>{{ product.category }}</v-card-subtitle>
        <v-img :src="product.image_url" height="200px" />
        <v-card-actions v-if="product.source_url">
          <v-btn
            color="primary"
            :href="product.source_url"
            target="_blank"
            text
            class="justify-center"
          >
            PRODUCT PAGE
          </v-btn>
        </v-card-actions>
       </v-card>
     </v-col>
   </v-row>

   <div ref="loadingTrigger" class="text-center my-4" v-if="hasMoreProducts">
     <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
   </div>
 </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import axios from 'axios'

interface Product {
 id: string
 title: string
 description: string | null
 price: string | null
 category: string
 source_url: string
 image_url: string | null
 discovered_at: string
 tags: string[]
 source: string
}

const BATCH_SIZE = 100
const products = ref<Product[]>([])
const searchQuery = ref('')
const loading = ref(false)
const offset = ref(0)
const limit = ref(BATCH_SIZE)
const hasMoreProducts = ref(true)
const loadingTrigger = ref<HTMLElement | null>(null)

const filteredProducts = computed(() =>
  products.value
)

async function fetchProducts(append = false) {
 if (loading.value) return

 try {
   loading.value = true
   console.log(`Fetching products with limit=${limit.value} and offset=${offset.value}${searchQuery.value ? ' and search=' + searchQuery.value : ''}`)

   const params = {
     limit: limit.value,
     offset: offset.value
   }

   if (searchQuery.value) {
     params.search = searchQuery.value
   }

   const res = await axios.get(`http://52.39.221.202:8000/products`, {
     params
   })

   if (res.data.length === 0) {
     hasMoreProducts.value = false
   } else {
     if (append) {
       products.value = [...products.value, ...res.data]
     } else {
       products.value = res.data
     }

     offset.value += res.data.length
   }
 } catch (error) {
   console.error('Fehler beim Laden der Produkte', error)
 } finally {
   loading.value = false
 }
}

function setupIntersectionObserver() {
 if (!loadingTrigger.value) return

 const observer = new IntersectionObserver((entries) => {
   const [entry] = entries
   if (entry.isIntersecting && !loading.value && hasMoreProducts.value) {
     fetchProducts(true)
   }
 }, { threshold: 0.1 })

 observer.observe(loadingTrigger.value)

 // Cleanup observer on component unmount
 onUnmounted(() => {
   if (loadingTrigger.value) {
     observer.unobserve(loadingTrigger.value)
   }
 })
}

// Reset products and pagination when search query changes
watch(searchQuery, () => {
  // Reset offset and fetch new results when search query changes
  offset.value = 0
  hasMoreProducts.value = true
  fetchProducts()
})

onMounted(() => {
 console.log('Mounted')
 fetchProducts()
 setupIntersectionObserver()
})
</script>

<style scoped>
.text-truncate {
 overflow: hidden;
 white-space: nowrap;
 text-overflow: ellipsis;
}
</style>
