import axios from 'axios';

class ValorantClient {

    private baseUrl: string = 'https://api.henrikdev.xyz/valorant';
  
    constructor() {
    }
  
    public async getUUID(playerName: string, tag: string) {

      const url = `${this.baseUrl}/v1/account/${playerName}/${tag}`;
      const response = await axios.get(url);

      return response.data;
    }

    public async getMMRHistory(uuid: string, region: string) {
      const url = `${this.baseUrl}/v1/by-puuid/mmr-history/${region}/${uuid}`;
      const response = await axios.get(url);

      return response.data;
    }

    public async getMatchesHistory(uuid: string, region: string) {
        const url = `${this.baseUrl}/v1/by-puuid/lifetime/matches/${region}/${uuid}`;
        const response = await axios.get(url);
  
        return response.data;
    }    
}

export default new ValorantClient();


