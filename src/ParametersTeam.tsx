import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VictoryPie } from 'victory';


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

interface Played {
  total: number;
  // Include other properties if available in the response
}
interface Draws {
  total: number;
  // Include other properties if available in the response
}
interface Loses {
  total: number;
  // Include other properties if available in the response
}
interface Wins {
  total: number;
  // Include other properties if available in the response
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
  const [lineups, setLineups] = useState<any[]>([]); // Add teams state variable
  const [minutes, setMinutes] = useState<any[]>([]); // Add teams state variable
  const [played, setPlayed] = useState<Played | null>(null); // Add teams state variable
  const [wins, setWins] = useState<Wins | null>(null);// Add teams state variable
  const [loses, setLoses] = useState<Loses | null>(null);// Add teams state variable
  const [draws, setDraws] = useState<Draws | null>(null);// Add teams state variable
  
  const data = Object.entries(minutes).map(([label, minute]) => ({
    x: label,
    y: minute.total,
  }));

  

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
            name: item.league.name,
            seasons: item.seasons.map((season: any) => season.year),
            id: item.league.id,
          }));
            setLeagues(extractedLeagues);
            console.log(extractedLeagues);
            console.log(extractedLeagues.seasons);
           
          
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

  useEffect(() => {
    const fetchLineups = async () => {
      try {
        if (selectedTeam && selectedSeason && selectedLeague) {
          const response = await axios.get(
            'https://v3.football.api-sports.io/teams/statistics',
            {
              headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'v3.football.api-sports.io',
              },
              params: {
                season: selectedSeason,
                team: selectedTeam,
                league: selectedLeague.id,
              },
            }
          );
          console.log(response.data)
          const lineups = response.data.response.lineups;
          const fixtures = response.data.response.fixtures;
          const played = fixtures.played
          console.log(played)
          const wins = fixtures.wins
          console.log(wins)
          const draws = fixtures.draws
          console.log(draws)
          const loses = fixtures.loses
          console.log(loses)
          const minutes = response.data.response.goals.for.minute
          console.log(lineups)
          console.log(minutes)
          console.log(fixtures)
          // Sort the lineups array by 'played' times in descending order
          setLineups(lineups);
          setPlayed(played);
          setWins(wins)
          setDraws(draws)
          setLoses(loses)
          // setLoses(loses)
          // setDraws(draws)
          setMinutes(minutes);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchLineups();
  }, [selectedTeam, selectedSeason, selectedLeague,apiKey]);

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
    setSelectedTeam(teamId);
    console.log(selectedTeam)
  };
  

  return (
    <div className="container">
      <h1 className="mt-5">Welcome to My Team Statistics</h1>
      <div className="row mt-4">
        <div className="col-md-6">
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
        </div>

        {selectedCountry && (
          <div className="col-md-6">
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
        <div className="row mt-4">
          <div className="col-md-6">
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

          {teams.length > 0 && (
            <div className="col-md-6">
              <h2>Select a Team:</h2>
              <div className="form-group">
                <select
                  className="form-control"
                  onChange={handleTeamChange}
                  value={selectedTeam || ''}
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.team.id} value={team.team.id}>
                      {team.team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
 </div>
      {teams.length > 0 && selectedCountry && selectedLeague && selectedSeason && selectedTeam && (
        <div className="mt-4 container">
          <div className='col-md-6'>
          <h2>Selected Team's Players:</h2>
          <ul className="list-group">
            {players.map((player) => (
              <li className="list-group-item" key={player.name}>
                <strong>Name:</strong> {player.name}, <strong>Age:</strong> {player.age}, <strong>Nationality:</strong> {player.nationality}
              </li>
            ))}
          </ul>
        </div>
        {lineups.length > 0 ? (
  <div className="col-md-6">
    <h2>Selected Team's Lineups:</h2>
    <ul className="list-group">
      {lineups.map((lineup) => (
        <li className="list-group-item" key={lineup.formation}>
          <strong>Formation:</strong> {lineup.formation}, <strong>Played:</strong> {lineup.played}
        </li>
      ))}
    </ul>
  </div>
) : (
  <div className="col-md-6">
    <p>No lineup information available for this team in the current season.</p>
  </div>
)}
{played && wins && loses && draws &&  (
  <div className='container'>
  <div className="col-md-6">
    <h2>Fixtures Summary:</h2>
    <ul className="list-group">
    
        <li className="list-group-item" key={played.total}>
          <strong>total of matches:</strong> {played.total}
        </li>
        <li className="list-group-item" key={wins.total}>
          <strong>total of wins:</strong> {wins.total}
        </li>
        <li className="list-group-item" key={loses.total}>
          <strong>total of loses:</strong> {loses.total}
        </li>
        <li className="list-group-item" key={draws.total}>
          <strong>total of draws:</strong> {draws.total}
        </li>
        
    </ul>
    <div style={{ width: '400px', height: '400px' }}>
          <h1>Number of Goals Scored per Game Time:</h1>
              <VictoryPie data={data} colorScale="qualitative" />
            </div>
  </div>
  </div>
)}



        </div>
      )}
    </div>
  );
};

export default ParametersPage;
