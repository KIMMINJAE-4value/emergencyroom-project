<script lang="ts">
import { ref } from 'vue'
import { NaverMap, NaverMarker } from '@naver-maps/vue'
import axios from 'axios'
import type { location } from '../types'

export default {
  components: {
    NaverMap,
    NaverMarker,
  },
  setup() {
    const mapRef = ref()
    const search = ref('')
    const regionResult = ref()
    const latitude = ref(37.51347)
    const longitude = ref(127.041722)
    const onLoadMap = (mapObject: naver.maps.Map) => {
      mapRef.value = mapObject
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

      console.log('2', result)

      mapRef.value.panToBounds(
        new naver.maps.LatLngBounds(
          new naver.maps.LatLng(37.2380651, 131.8562652),
          new naver.maps.LatLng(37.2444436, 131.8786475),
        ),
      )
    }

    const onSearchLocation = async (data: location) => {
      const tm128 = new naver.maps.LatLng(data.mapy, data.mapx)

      latitude.value = tm128.lat()
      longitude.value = tm128.lng()
      onSearchEmergencyRoom()
    }

    return {
      search,
      regionResult,
      latitude,
      longitude,
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
  <NaverMap
    style="width: 100vw; height: 100vh"
    clientId="y7hgcvgnrx"
    @onLoaded="onLoadMap"
    :mapOptions="{
      latitude: latitude,
      longitude: longitude,
      zoom: 14,
    }"
  >
    <naver-marker
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
    </naver-marker>
  </NaverMap>
</template>
