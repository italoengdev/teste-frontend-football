import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ParametersPageProps {
  apiKey: string;
}

interface Country {
  name: string;
  code: string;
}

interface League {
  seasons: any;
  name: string;
  id: number;
  season: number;
}

interface Player {
  name: string;
  age: number;
  nationality: string;
}

const ParametersPage: React.FC<ParametersPageProps> = ({ apiKey }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [teams, setTeams] = useState<any[]>([]); // Add teams state variable
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://v3.football.api-sports.io/countries', {
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        });
        setCountries(response.data.response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
  }, [apiKey]);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        if (selectedCountry) {
          const response = await axios.get(
            `https://v3.football.api-sports.io/leagues?country=${selectedCountry.name}`,
            {
              headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'v3.football.api-sports.io',
              },
            }
          );
          console.log(response.data.response);
          const extractedLeagues = response.data.response.map((item: any) => ({
            name: item.name,
            seasons: item.seasons.map((season: { season: any; }) => season.season),
            id: item.id,
          }));
            setLeagues(extractedLeagues);
            console.log(extractedLeagues);
            console.log(extractedLeagues.seasons.s);
           
          
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchLeagues();
  }, [apiKey, selectedCountry]);
  

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (selectedLeague && selectedSeason) {
          const leagueName = selectedLeague.id;
          const countryName = selectedCountry!.name;

          const response = await axios.get(
            `https://v3.football.api-sports.io/teams?league=${leagueName}&country=${countryName}&season=${selectedSeason}`,
            {
              headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'v3.football.api-sports.io',
              },
            }
          );
          console.log(response);
          console.log(response.data.response);
          setTeams(response.data.response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeams();
  }, [apiKey, selectedLeague, selectedCountry, selectedSeason]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        if (selectedTeam && selectedSeason) {
          const response = await axios.get(
            'https://v3.football.api-sports.io/players',
            {
              headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'v3.football.api-sports.io',
              },
              params: {
                team: selectedTeam,
                season: selectedSeason,
              },
            }
          );
          const extractedPlayers = response.data.response.map((player: any) => ({
            name: player.player.name,
            age: player.player.age,
            nationality: player.player.nationality,
          }));
          setPlayers(extractedPlayers);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlayers();
  }, [apiKey, selectedTeam, selectedSeason]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;
    const selected = countries.find((country) => country.code === countryCode);
    setSelectedCountry(selected || null);
    setSelectedLeague(null);
    setSelectedTeam(null);

  };

  const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = parseInt(event.target.value);
    const selected = leagues.find((league) => league.id === leagueId);
    setSelectedLeague(selected || null);
    setSelectedTeam(null);

  };

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonYear = parseInt(event.target.value);
    setSelectedSeason(seasonYear);
    setTeams([]);
  };


  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = parseInt(event.target.value);
    const selected = teams.find((team) => team.id === teamId);
    setSelectedTeam(selected || null);
  };
  

  return (
    <div className="container">
      <h1>Welcome to My Team Statistics</h1>
      <h2>Select Country:</h2>
      <div className="form-group">
        <select
          className="form-control"
          onChange={handleCountryChange}
          value={selectedCountry?.code || ''}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div>
          <h2>Select a League:</h2>
          <div className="form-group">
            <select
              className="form-control"
              onChange={handleLeagueChange}
              value={selectedLeague?.id || ''}
            >
              <option value="">Select a league</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {selectedCountry && selectedLeague && (
        <div>
          <h2>Select a Season:</h2>
          <div className="form-group">
            <select
              className="form-control"
              onChange={handleSeasonChange}
              value={selectedSeason || ''}
            >
              <option value="">Select a season</option>
              {selectedLeague.seasons.map((season: any) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {teams.length > 0 && selectedCountry && selectedLeague && selectedSeason && (
        <div>
          
          <div className="form-group">
            <h2>Teams:</h2>
            <select
              className="form-control"
              onChange={handleTeamChange}
              value={selectedTeam || ''}
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}


{teams.length > 0 && selectedCountry && selectedLeague && selectedSeason && selectedTeam && (
        <div>
          <h2>Selected Team:</h2>
          <div>
            <p>Name: {selectedTeam}</p>
          </div>
          <h2>Selected Team's Players:</h2>
          <ul>
            {players.map((player) => (
              <li key={player.name}>
                Name: {player.name}, Age: {player.age}, Nationality: {player.nationality}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParametersPage;
