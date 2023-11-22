<template>
    <div class="hero min-h-screen">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">Create your custom Valorant overlay in seconds!</h1>
          <p class="py-6">Enhance your stream with real-time statistics hassle-free and without registration. Customize your own overlay with crucial player information and elevate your streaming experience on OBS and other platforms. Stand out with your skills and keep your viewers informed effortlessly and easily!</p>
        </div>
        <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div class="card-body">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Enter your Riot ID & Tag</span>
              </label>
              <input type="text" v-model="id" placeholder="I miss her#123" class="input input-bordered" required />
            </div>
            <div class="form-control mt-6">
              <button class="btn btn-primary" @click="goToOverlay">Get My Overlay</button>
            </div>
           <!--  <router-link to="/overlay/valorant/{{ id }}" >Go to Home</router-link> -->
        </div>
        </div>
      </div>
    </div>
  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
  <aside>
    <p>Copyright © {{ new Date().getFullYear() }} - Created with ❤️ by @SoyAlexity</p>
  </aside>
</footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const id = ref('')


function validateId() {
  // validate if the id value is not empty and has the following format username#tag using regex the username can contains special characters
  if (id.value === '' || !id.value.match(/^[^#]+#[^#]+$/)) {
    return false;
  }
  return true;
  
}
// funtions
function goToOverlay() {
  if (!validateId()) {
    alert('Please enter a valid Riot ID and Tag, Example: I miss her#123');
    return;
  }
  router.push({
        name: 'Overlay',
        query: {
            name: id.value.split('#')[0],
            tag: id.value.split('#')[1]
        }
  })
}

</script>