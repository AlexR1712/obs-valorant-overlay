<template>
<div class="stats bg-no-repeat bg-cover" v-if="loaded"
:class="`bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.98),rgba(36,36,36,0.85)),url('${profileSummary.card.wide}')]`">
  <div class="stat" :class="{ skeleton: !loaded }" >
<!--     <figure><img src="https://media.valorant-api.com/playercards/43b78d51-47c7-ac2e-2939-92858e2bf7db/smallart.png" alt="Shoes" /></figure> -->
    <div class="stat-figure text-secondary">
      <div class="avatar">
        <div class="w-16 rounded-full">
          <img :src="profileSummary.rank.image" />
        </div>
      </div>
    </div>
    <div class="stat-title">Rating</div>
    <div class="stat-value">{{ profileSummary.rank.tier }}</div>
    <div class="stat-title">{{ profileSummary.rank.ranking_tier }} RR</div>
    <div class="stat-value">Level {{ profileSummary.level }}</div>
    <div class="stat-desc text-xl">{{ profileSummary.name }}#{{ profileSummary.tag }}</div>
  </div>

  <div class="stat">
    <div class="stat-figure text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-8 h-8 stroke-current">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>

    </div>
    <div class="stat-title">Stats</div>
    <div class="stat-value">K/D {{ profileSummary.stats.kd.toFixed(2) }}</div>
    <div class="stat-value">ACS {{ profileSummary.stats.acs.toFixed(2) }}</div>
    <div class="stat-value">ELO {{ profileSummary.rank.elo }}</div>
    <div class="stat-desc text-xl">{{profileSummary.stats.winrate.toFixed(2)}}% Win Rate</div>
    <!-- <div class="stat-desc">21% Win Rate</div> -->
  </div>
  

  
</div>




</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ValorantClient from '../services/ValorantClient.ts'

const route = useRoute()

const loaded = ref(false);
const profileSummary:any = ref({})

function summarizedMatches(matchesList:any) {
  const competitiveMatches = matchesList.reduce((acc:any, match:any) => {
    if (match.meta.mode === "Competitive") {
      acc.matchesAmount += 1;
      acc.kills += match.stats.kills;
      acc.deaths += match.stats.deaths;
      acc.assists += match.stats.assists;
      acc.acs += match.stats.score / (match.teams.blue + match.teams.red); // AVERAGE COMBAT SCORE
      acc.adr += match.stats.damage.made / (match.teams.blue + match.teams.red);

      // determine win or lost
      if (match.stats.team === 'Blue' && match.teams.blue > match.teams.red) {
        acc.win += 1;
      } else if (match.stats.team === 'Red' && match.teams.red > match.teams.blue) {
        acc.win += 1;
      } else {
        acc.lost += 1;
      }
    }
    return acc;
  }, {
    matchesAmount: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    acs: 0,
    adr: 0,
    win: 0,
    lost: 0,
  });

  console.log(competitiveMatches)

  const { matchesAmount, kills, deaths, assists, acs, adr } = competitiveMatches;
  const kd = kills / deaths;
  const kda = (kills + assists) / deaths;
  const AverageCombatScore = acs / matchesAmount
  const AverageDamageRound = adr / matchesAmount
  const winrate = (competitiveMatches.win / competitiveMatches.matchesAmount) * 100;

  return {
    kills,
    deaths,
    assists,
    kd,
    kda,
    acs: AverageCombatScore,
    adr: AverageDamageRound,
    competitiveMatchesAmount: matchesAmount,
    winrate: winrate,
  };
}

onMounted(async () => {
      const profileRequest = await ValorantClient.getUUID(route.query.name, route.query.tag);
      const profile = profileRequest.data

      const mmrRequest = await ValorantClient.getMMRHistory(profile.puuid, profile.region);
      const mmrData = mmrRequest.data

      const matchesRequest = await ValorantClient.getMatchesHistory(profile.puuid, profile.region);
      const matchesData = matchesRequest.data

      //console.log(overlayData)
      let lastMatchInfo = mmrData[0];

      profileSummary.value = {
        name: profile.name,
        tag: profile.tag,
        level: profile.account_level,
        card: profile.card,
        rank: {
          tier: lastMatchInfo.currenttierpatched,
          ranking_tier: lastMatchInfo.ranking_in_tier,
          image: lastMatchInfo.images.small,
          elo: lastMatchInfo.elo
        },
        mmrHistory: mmrData,
        matches: matchesData,
        stats: summarizedMatches(matchesData)
      }

      loaded.value = true

      console.log(profileSummary.value)

});

</script>

<style>

:root, [data-theme] {
  background: transparent !important;
}

</style>