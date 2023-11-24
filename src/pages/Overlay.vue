<template>
<div class="stats glass" v-if="loaded"
:class="`bg-[url('${store.profile.card.wide}')]`">
  <div class="stat" :class="{ skeleton: !loaded }" >
    <div class="stat-figure text-secondary">
      <div class="avatar">
        <div class="w-16 rounded-full">
          <img :src="store.tier.images.small" />
        </div>
      </div>
    </div>
    <div class="stat-title">Rating</div>
    <div class="stat-value">{{ store.tier.rank }}</div>
    <div class="stat-title">{{ store.tier.ranking_in_tier }} RR</div>
    <div class="stat-value">Level {{ store.profile.account_level }}</div>
    <div class="stat-desc text-xl">{{ store.profile.name }}#{{ store.profile.tag }}</div><!-- 
    <div class="stat-desc text-xl">Last Update: {{ store.profile.last_update }}</div> -->
  </div>

  <div class="stat">
    <div class="stat-figure text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-8 h-8 stroke-current">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>

    </div>
    <div class="stat-title">Stats</div>
    <div class="stat-value">K/D {{ store.stats.kd.toFixed(2) }}</div>
    <div class="stat-value">ACS {{ store.stats.acs.toFixed(2) }}</div>
    <div class="stat-value">ELO {{ store.tier.elo }}</div>
    <div class="stat-desc text-xl">{{store.stats.winrate.toFixed(2)}}% Win Rate</div>
    <!-- <div class="stat-desc">21% Win Rate</div> -->
    <div class="avatar-group -space-x-2.5 rtl:space-x-reverse">
      <template v-for="i in 5" :key="i">
        <div class="avatar border-2 bg-base-100" :class="{ 'border-success': isWonGame(store.competitiveMatches[i]), 'border-error': ! isWonGame(store.competitiveMatches[i]) }">
          <div class="w-6">
            <img :src="getCharacterIcon(store.competitiveMatches[i].stats.character.id)" />
          </div>
        </div>        
      </template>
    </div>
  </div>  
  
</div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ValorantClient from '../services/ValorantClient.ts'
import { useOverlayStore } from '../stores/OverlayStore.ts'

const store = useOverlayStore()
const route = useRoute()

const loaded = ref(false);


function getCharacterIcon(characterId:string) {
  return `https://titles.trackercdn.com/valorant-api/agents/${characterId}/displayicon.png`
}

function isWonGame(match:any) {
  let result = false
  if (match.stats.team === 'Blue' && match.teams.blue > match.teams.red) {
    result = true
  } else if (match.stats.team === 'Red' && match.teams.red > match.teams.blue) {
    result = true
  }
  return result
}

async function init() {
  const profileRequest = await ValorantClient.getUUID(route.query.name, route.query.tag);
  const mmrRequest = await ValorantClient.getMMRHistory(profileRequest.data.puuid, profileRequest.data.region);
  const matchesRequest = await ValorantClient.getMatchesHistory(profileRequest.data.puuid, profileRequest.data.region);

  return {
    profile: profileRequest.data,
    mmr: mmrRequest.data,
    matches: matchesRequest.data
  }
}

async function refresh(patch = false) {
  let data = await init()
  if (patch) {    
    store.$patch(data)
  } else {
    store.$state = data
  }  
}

onMounted(async () => {
      // set default state
      let minutesToUpdate = 25;
      await refresh()

      setInterval(async () => {
        await refresh(true)
      }, minutesToUpdate * 60 * 1000)

      loaded.value = true
});

</script>

<style>

:root, [data-theme] {
  background: transparent !important;
}

</style>