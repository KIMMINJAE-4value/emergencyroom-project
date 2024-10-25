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
    const markers = ref<any[]>([])
    let saveInfoWindow: any
    const onLoadMap = (map: any) => {
      mapRef.value = map
      const latLng = new window.naver.maps.LatLng(37.51347, 127.041722)
      map.setCenter(latLng) // Change Map Center
      mapRef.value.setZoom(12, true)
    }

    const onInput = async (event: any) => {
      search.value = (event.target as HTMLInputElement).value
      if (search.value != '') {
        naver.maps.Service.geocode(
          {
            query: search.value,
          },
          (status: any, response: any) => {
            let result = response.v2
            regionResult.value = result.addresses
          },
        )
      }
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
      markers.value.forEach(marker => {
        marker.setMap(null)
      })
      markers.value = []

      if (saveInfoWindow != undefined) saveInfoWindow.close()

      if (result.data.response.body.items.item == undefined) {
        alert('데이터가 없습니다.')
      } else if (Array.isArray(result.data.response.body.items.item)) {
        result.data.response.body.items.item.forEach(
          (element: any, i: number) => {
            if (i === 0) {
              mapRef.value.setCenter(
                new naver.maps.LatLng(element.wgs84Lat, element.wgs84Lon),
              )
            }
            setExpressMarker(element)
          },
        )
      } else {
        setExpressMarker(addressResult.value)
        mapRef.value.setCenter(
          new naver.maps.LatLng(
            addressResult.value.wgs84Lat,
            addressResult.value.wgs84Lon,
          ),
        )
      }
    }

    const onSearchLocation = (data: location) => {
      if (data != undefined) onSearchEmergencyRoom(data.addressElements)
    }

    const setEventOnMarker = (marker: any, hospitalName: string) => {
      let contentString = [
        '<div class="iw_inner">',
        '   <h3>' + hospitalName + '</h3>',

        '</div>',
      ].join('')

      let infowindow = new naver.maps.InfoWindow({
        content: contentString,
      })

      saveInfoWindow = infowindow
      naver.maps.Event.addListener(marker, 'click', (e: any) => {
        if (infowindow.getMap()) {
          infowindow.close()
        } else {
          infowindow.open(mapRef.value, marker)
        }
      })
    }

    const setExpressMarker = (addressInfo: any) => {
      let marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          addressInfo.wgs84Lat,
          addressInfo.wgs84Lon,
        ),
        map: mapRef.value,
      })
      markers.value.push(marker)

      setEventOnMarker(marker, addressInfo.dutyName)

      mapRef.value.setZoom(12, true)
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
    }
  },
}
</script>

<template>
  <div>
    <input
      placeholder="검색"
      @input="onInput"
      @keydown.enter="onSearchLocation(regionResult[0])"
      type="text"
    />
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
