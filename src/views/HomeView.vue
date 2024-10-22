<script lang="ts">
import { ref } from 'vue'
import { NaverMap } from '@naver-maps/vue'

export default {
  components: {
    NaverMap,
  },
  setup() {
    const search = ref('')
    const onLoadMap = (map: naver.maps.Map) => {
      console.log(map)
      // 지도 로드 완료 시 실행되는 함수
    }

    return { search, onLoadMap }
  },
}
</script>

<template>
  <input v-model="search" placeholder="검색" />
  <br />

  <NaverMap
    style="width: 100vw; height: 100vh"
    clientId="y7hgcvgnrx"
    @onLoaded="onLoadMap"
    :mapOptions="{
      latitude: 37.51347,
      longitude: 127.041722,
      zoom: 14,
    }"
  >
  </NaverMap>
</template>
