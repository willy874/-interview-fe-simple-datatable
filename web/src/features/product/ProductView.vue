<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton, ElPagination, ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus';
import type { FormItemRule } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import { useGetProductList, useLogout } from './services';
import { useQuery } from '@tanstack/vue-query';
import type { ProductModel } from '@/resources/products';
import type { SortChangeInfo, TableScope } from '@/libs/ui';

const DEFAULT_CURRENT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

const ruleFormRef = ref<typeof ElForm | null>(null)

const form = reactive({
  searchText: '',
  currentPage: DEFAULT_CURRENT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  orderBy: null as 'ascending' | 'descending' | null,
  sortKey: null as 'name' | 'stock' | 'price' | null,
  total: 0,
})

const requestDto = reactive({
  searchText: undefined as string | undefined,
  currentPage: DEFAULT_CURRENT_PAGE as number | undefined,
  pageSize: DEFAULT_PAGE_SIZE as number | undefined,
  orderBy: undefined as 'asc' | 'desc' | undefined,
  sortKey: undefined as 'name' | 'stock' | 'price' | undefined,
})

const onSubmitFilter = () => {
  if (form.searchText && form.searchText.trim().length >= 2) {
    requestDto.searchText = form.searchText
  } else {
    requestDto.searchText = undefined
  }
  if (form.currentPage) {
    requestDto.currentPage = form.currentPage
  } else {
    requestDto.currentPage = undefined
  }
  if (form.pageSize) {
    requestDto.pageSize = form.pageSize
  } else {
    requestDto.pageSize = undefined
  }
  if (form.orderBy) {
    switch (form.orderBy) {
      case 'ascending':
        requestDto.orderBy = 'asc'
        break
      case 'descending':
        requestDto.orderBy = 'desc'
        break
      default:
        requestDto.orderBy = undefined
    }
  } else {
    requestDto.orderBy = undefined
  }
  if (form.sortKey) {
    requestDto.sortKey = form.sortKey
  } else {
    requestDto.sortKey = undefined
  }
}

const filterKey = computed(() => {
  return [
    'ProductList',
    requestDto.searchText,
    requestDto.currentPage,
    requestDto.pageSize,
    requestDto.orderBy,
    requestDto.sortKey,
  ] as const
})

const getProductList = useGetProductList()
const { data: products } = useQuery({
  queryKey: filterKey,
  queryFn: ({ queryKey }) => {
    const [_, search, currentPage, pageSize, orderBy, sortKey] = queryKey
    return getProductList({
        q: search,
        p: currentPage,
        page_size: pageSize,
        order_by: orderBy,
        sort_by: sortKey,
      }).then((res) => {
        form.total = res.body.total
        return res
      })
  },
  select: (data) => data.body.products,
})

const tableData = computed(() => {
  if (!products.value) {
    return []
  }
  return products.value
})

const productPriceSum = (scope: TableScope<ProductModel>) => {
  return scope.row.price * scope.row.stock
}

const onSearchSubmit = () => {
  ruleFormRef.value?.validate().then(() => {
    onSubmitFilter()
  })
}

const onSortChange = (info: SortChangeInfo<ProductModel>) => {
  form.sortKey = info.prop
  form.orderBy = info.order
  onSubmitFilter()
}

const filterRules = {
  searchText: {
    required: false,
    validator: (_, value) => {
      if (value === '') {
        return true
      }
      if (value && value.trim().length < 2) {
        return new Error('搜尋字元至少要兩個字')
      } else {
        return true
      }
    }
  },
} as const satisfies Record<string, FormItemRule>

const logout = useLogout()
const onLogout = () => logout('/logout')
</script>

<template>
  <div class="product-page">
    <div class="product-page__header">
      <h2>商品列表</h2>
      <el-button @click="onLogout">Logout</el-button>
    </div>
    <el-form :model="form" ref="ruleFormRef" @submit.prevent="onSearchSubmit" class="product-page__filter-form" :rules="filterRules">
      <el-form-item prop="searchText">
        <el-input v-model="form.searchText" style="width: 240px" placeholder="搜尋商品名稱">
          <template #prepend>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="product-page__table"
      @sort-change="onSortChange"
    >
      <el-table-column prop="name" label="商品名稱" sortable="custom"></el-table-column>
      <el-table-column prop="price" label="價格" sortable="custom">
        <template #default="scope">
          <div class="product-page__text-secondary">{{ `$${scope.row.price}` }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="庫存" sortable="custom">
        <template #default="scope">
          <div v-if="scope.row.stock <= 10" class="product-page__danger">
            {{ scope.row.stock }}(低庫存)
          </div>
          <div v-else class="product-page__text-secondary">{{ scope.row.stock }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="總價值" min-width="120">
        <template #default="scope">
          <div class="product-page__text-secondary">{{ `$${productPriceSum(scope)}` }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="product-page__pagination">
      <div class="product-page__total">
        <span class="product-page__text-secondary">Showing</span>
        <span>{{ form.pageSize * (form.currentPage - 1) + 1 }}</span>
        <span>-</span>
        <span>{{ form.pageSize * form.currentPage }}</span>
        <span class="product-page__text-secondary">of</span>
        <span>{{ form.total }}</span>
      </div>
      <div class="product-page__sizes">
        <el-select v-model="form.pageSize" style="width: 80px;">
          <el-option label="10" value="10" />
          <el-option label="20" value="20" />
          <el-option label="40" value="40" />
        </el-select>
        <span class="product-page__text-secondary">products per page</span>
      </div>
      <el-pagination
        v-model:current-page="form.currentPage"
        v-model:page-size="form.pageSize"
        background
        layout="prev, pager, next"
        :total="form.total"
        @change="onSubmitFilter"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.product-page {
  flex-grow: 1;
  padding: 1rem;
}
.product-page__header {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-page__filter-form {
  margin-bottom: 1rem;
}
.product-page__table {
  margin-bottom: 1rem;
  --el-table-header-bg-color: #f9f9f9;
}
.product-page__text-secondary {
  color: #666;
}
.product-page__danger {
  color: red;
}
.product-page__total {
  display: flex;
  gap: .25rem;
  align-items: center;
}
.product-page__sizes {
  display: flex;
  gap: .5rem;
  align-items: center;
}
.product-page__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-page__pagination::v-deep(.el-pagination__total) {
  flex-grow: 1;
}
.product-page__pagination::v-deep(.el-pagination__sizes) {
  flex-grow: 1;
}
</style>
