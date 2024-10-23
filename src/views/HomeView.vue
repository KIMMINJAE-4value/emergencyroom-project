<script lang="ts">
import { ref } from 'vue'
import { NaverMap } from 'vue3-naver-maps'
import axios from 'axios'
import type { location } from '../types'

export default {
  components: {
    NaverMap,
  },
  setup() {
    const mapRef = ref()
    const search = ref('')
    const regionResult = ref()
    const addressResult = ref()
    const onLoadMap = (map: any) => {
      mapRef.value = map
      const latLng = new window.naver.maps.LatLng(37.51347, 127.041722) // window 생략 가능
      map.setCenter(latLng) // Change Map Center
    }

    const onInput = async () => {
      console.log(search.value)
      if (search.value != '') {
        naver.maps.Service.geocode(
          {
            query: search.value,
          },
          (status: any, response: any) => {
            if (status !== naver.maps.Service.Status.OK) {
              return alert('Something wrong!')
            }

            let result = response.v2 // 검색 결과의 컨테이너
            let items = result.addresses // 검색 결과의 배열
            regionResult.value = result.addresses

            // do Something
          },
        )
      }
    }

    const marker = ref()
    const onLoadMarker = (markerObject: object) => {
      marker.value = markerObject
    }

    const onSearchEmergencyRoom = async (addressElements: Array<any>) => {
      const params = {
        Q0: addressElements[0].longName,
        Q1:
          addressElements[1].longName != '' ? addressElements[1].longName : '',
        pageNo: 1,
        numOfRows: 10,
        serviceKey: import.meta.env.VITE_API_SERVICE_KEY,
      }
      const result = await axios.get(import.meta.env.VITE_API_URI, { params })

      addressResult.value = result.data.response.body.items.item

      console.log('res', result.data.response.body.items.item)
      var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(37.3595704, 127.105399),
        map: mapRef.value,
      })
    }

    const onSearchLocation = async (data: location) => {
      console.log(data.addressElements)

      mapRef.value.setCenter(new naver.maps.LatLng(data.y, data.x))
      onSearchEmergencyRoom(data.addressElements)
    }

    return {
      search,
      regionResult,
      mapRef,
      addressResult,
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
    <input v-model="search" placeholder="검색" @input="onInput" />
  </div>
  <br />

  <div
    v-for="region of regionResult"
    :key="region"
    @click="onSearchLocation(region)"
  >
    {{ region.roadAddress }}
  </div>
  <NaverMap style="width: 100vw; height: 100vh" @onLoad="onLoadMap"> </NaverMap>
</template>
