import { defineStore } from 'pinia'

export const useOverlayStore = defineStore('overlay', {

  state: () => {
    const matches: any = []
    const profile: any = {}
    const mmr: any     = []  
    return { profile, matches, mmr }
  },
  getters: {
    tier(): any {
      let lastMmr = this.mmr.shift()
      return {
        elo: lastMmr.elo, 
        rank: lastMmr.currenttierpatched, 
        ranking_in_tier: lastMmr.ranking_in_tier,
        images: lastMmr.images,
      }
    },
    stats(): any {
      let competitiveMatches = this.matches.reduce((acc:any, match:any) => {
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
    },
    competitiveMatches(): any {
      return this.matches.filter((match: any) => match.meta.mode === "Competitive")
    }
  },

})