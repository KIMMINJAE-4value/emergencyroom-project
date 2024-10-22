<script lang="ts">
import { ref } from 'vue'
import { NaverMap } from '@naver-maps/vue'
import axios from 'axios'

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
    const onSearch = async () => {
      const params = {
        STAGE1: '서울특별시',
        STAGE2: '강남구',
        pageNo: 1,
        numOfRows: 30,
        serviceKey:
          'Y7vAdTl7q7jOH5H6IKsEyWH0/GEO20KLTe+wxnTDJYmC8ewsrBJ7wIekeCwBMxTvgpNlGbxsvKijRsQN2xcPxQ==',
      }
      const data = await axios.get(
        'http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire',
        { params },
      )
      console.log(data.data)
    }

    return { search, onLoadMap, onSearch }
  },
}
</script>

<template>
  <input v-model="search" placeholder="검색" @input="onSearch" />
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
