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
    const regionResult = ref()
    const onLoadMap = (map: naver.maps.Map) => {
      console.log(map)
      // 지도 로드 완료 시 실행되는 함수
    }

    const onInput = async () => {
      if (search.value != '') {
        const params = {
          query: search.value,
          display: 5,
        }
        const result = await axios.get('/naver/search/local.json', {
          params,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'X-Naver-Client-Id': 'Ar_xVXx4bqK9Ad6afc0w',
            'X-Naver-Client-Secret': 'Av6fnTgyGe',
          },
        })

        regionResult.value = result.data.items
      }
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
      const result = await axios.get(
        'http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire',
        { params },
      )

      console.log(result)
    }

    return { search, regionResult, onLoadMap, onSearch, onInput }
  },
}
</script>

<template>
  <div>
    <input
      v-model="search"
      placeholder="검색"
      @input="onInput"
      @keyup.enter="onSearch"
    />
  </div>
  <br />

  <div v-for="region of regionResult" :key="region">
    {{ region.title }}
  </div>
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
