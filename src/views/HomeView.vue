<script lang="ts">
import { ref } from 'vue'
import { NaverMap } from 'vue3-naver-maps'
import axios from 'axios'
import type { location } from '../types'
declare let naver: any

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

    const onInput = async (event: any) => {
      search.value = (event.target as HTMLInputElement).value
      if (search.value != '') {
        naver.maps.Service.geocode(
          {
            query: search.value,
          },
          (status: any, response: any) => {
            let result = response.v2 // 검색 결과의 컨테이너
            regionResult.value = result.addresses
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

      if (Array.isArray(result.data.response.body.items.item)) {
        result.data.response.body.items.item.forEach(
          (element: any, i: number) => {
            if (i === 0) {
              mapRef.value.setCenter(
                new naver.maps.LatLng(element.wgs84Lat, element.wgs84Lon),
              )
            }
            new naver.maps.Marker({
              position: new naver.maps.LatLng(
                element.wgs84Lat,
                element.wgs84Lon,
              ),
              map: mapRef.value,
            })
          },
        )
      } else {
        new naver.maps.Marker({
          position: new naver.maps.LatLng(
            addressResult.value.wgs84Lat,
            addressResult.value.wgs84Lon,
          ),
          map: mapRef.value,
        })
        mapRef.value.setCenter(
          new naver.maps.LatLng(
            addressResult.value.wgs84Lat,
            addressResult.value.wgs84Lon,
          ),
        )
      }
    }

    const onSearchLocation = async (data: location) => {
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
    <input placeholder="검색" @input="onInput" type="text" />
  </div>

  <div
    v-for="region of regionResult"
    :key="region"
    @click="onSearchLocation(region)"
  >
    {{ region.roadAddress }}
  </div>
  <div>
    <NaverMap style="width: 100vw; height: 100vh" @onLoad="onLoadMap">
    </NaverMap>
  </div>
</template>
