<script lang="ts">
import { ref } from 'vue'
import { NaverMap } from 'vue3-naver-maps'
import axios from 'axios'
import type { location } from '../types'

export default {
  components: {
    NaverMap,
    // NaverMarker,
  },
  setup() {
    const mapRef = ref()
    const search = ref('')
    const regionResult = ref()
    const onLoadMap = (map: any) => {
      mapRef.value = map
      console.log(1, map)
      const latLng = new window.naver.maps.LatLng(37.51347, 127.041722) // window 생략 가능
      map.setCenter(latLng) // Change Map Center
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

    const marker = ref()
    const onLoadMarker = (markerObject: object) => {
      marker.value = markerObject
    }

    const onSearchEmergencyRoom = async () => {
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
    }

    const onSearchLocation = async (data: location) => {
      console.log('1', data)
      const tm128 = new window.naver.maps.Point(data.mapx, data.mapy)
      console.log('2', tm128)
      const latLng = window.naver.maps.TransCoord.fromTM128ToLatLng(tm128)
      console.log('3', latLng)

      mapRef.value.setCenter(new window.naver.maps.LatLng(39.51347, 129.041722))
      console.log(mapRef.value)
      onSearchEmergencyRoom()
    }

    return {
      search,
      regionResult,
      mapRef,
      onLoadMap,
      onSearchEmergencyRoom,
      onInput,
      onSearchLocation,
      onLoadMarker,
    }
  },
}
</script>

<template>
  <div>
    <input
      v-model="search"
      placeholder="검색"
      @input="onInput"
      @keyup.enter="onSearchEmergencyRoom"
    />
  </div>
  <br />

  <div
    v-for="region of regionResult"
    :key="region"
    @click="onSearchLocation(region)"
  >
    {{ region.title }}
  </div>
  <NaverMap style="width: 100vw; height: 100vh" @onLoad="onLoadMap"> </NaverMap>
  <!-- <naver-marker
    :latitude="37.51347"
    :longitude="127.041722"
    @onLoad="onLoadMarker($event)"
  >
  </naver-marker>

  <naver-marker
    :latitude="37.41347"
    :longitude="127.041722"
    @onLoad="onLoadMarker($event)"
  >
  </naver-marker> -->
</template>
