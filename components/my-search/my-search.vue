<template>
  <view class="my-search-container" :style="{'background': bgcolor}">
    <!-- 使用 view 组件模拟 input 输入框的样式 -->
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandle">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		},
		props:{
			// 背景颜色
			bgcolor: {
				type: String,
				default: '#ff0000'
			},
			radius: {
				type: Number,
				default: 14
			}
		},
		methods:{
			searchBoxHandle(){
				
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
.my-search-container {
	
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  
}

.my-search-box {
  height: 36px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  .placeholder {
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>