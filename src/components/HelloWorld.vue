<script setup lang="ts">
import {ref} from 'vue'

defineProps<{ msg: string }>()

const notificationBtn = ref(true)

// function checkNotificationPromise() {
//   try {
//     Notification.requestPermission().then();
//   } catch(e) {
//     return false;
//   }
//
//   return true;
// }

function askNotificationPermission() {
  // // 권한을 실제로 요구하는 함수
  // function handlePermission(permission :any) {
  //   console.log(permission,"permision")
  //   // 사용자의 응답에 관계 없이 크롬이 정보를 저장할 수 있도록 함
  //   if(!('permission' in Notification)) {
  //     console.log("탐?")
  //     Notification.permission = 'default';
  //   }
  //
  //   // 사용자 응답에 따라 단추를 보이거나 숨기도록 설정
  //   if(Notification.permission === 'denied' || Notification.permission === 'default') {
  //     notificationBtn.value = true;
  //   } else {
  //     notificationBtn.value = false;
  //   }
  // }
  //
  // // 브라우저가 알림을 지원하는지 확인
  // if (!('Notification' in window)) {
  //   console.log("이 브라우저는 알림을 지원하지 않습니다.");
  // } else {
  //   console.log("타요?")
  //   if(checkNotificationPromise()) {
  //     Notification.requestPermission()
  //         .then((permission) => {
  //           handlePermission(permission);
  //         })
  //   } else {
  //     Notification.requestPermission(function(permission) {
  //       handlePermission(permission);
  //     });
  //   }
  // }
}


</script>

<template>
  <div class="card">
    <button id="enable" :style="{'background-color': notificationBtn? 'green':'red'  }" @click="askNotificationPermission">
      알림 허용
    </button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
