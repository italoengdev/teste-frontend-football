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

const ParametersPage: React.FC<ParametersPageProps> = ({ apiKey }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [teams, setTeams] = useState<any[]>([]);

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
          const leagueName = selectedLeague.name;
          const countryName = selectedCountry!.name;

          const response = await axios.get(
            `https://v3.football.api-sports.io/teams?name=${leagueName}&country=${countryName}&season=${selectedSeason}`,
            {
              headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'v3.football.api-sports.io',
              },
            }
          );

          setTeams(response.data.response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeams();
  }, [apiKey, selectedLeague, selectedCountry, selectedSeason]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;
    const selected = countries.find((country) => country.code === countryCode);
    setSelectedCountry(selected || null);
    setSelectedLeague(null);
  };

  const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = parseInt(event.target.value);
    const selected = leagues.find((league) => league.id === leagueId);
    setSelectedLeague(selected || null);
  };

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonYear = parseInt(event.target.value);
    setSelectedSeason(seasonYear);
    setTeams([]);
  };

  return (
    <div>
      <h2>Select Country:</h2>
      <div>
        <select
          className="form-select bg-light"
          onChange={handleCountryChange}
          value={selectedCountry?.code || ''}
        >
          <option className="bg-light" value="">
            Select a country
          </option>
          {countries.map((country) => (
            <option className="bg-light" key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div>
          <h2>Select a League:</h2>
          <div>
            <select
              className="form-select bg-light"
              onChange={handleLeagueChange}
              value={selectedLeague?.id || ''}
            >
              <option className="bg-light" value="">
                Select a league
              </option>
              {leagues.map((league) => (
                <option className="bg-light" key={league.id} value={league.id}>
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
          <div>
            <select
              className="form-select bg-light"
              onChange={handleSeasonChange}
              value={selectedSeason || ''}
            >
              <option className="bg-light" value="">
                Select a season
              </option>
              {selectedLeague.seasons.map((season: any) => (
                <option className="bg-light" key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {selectedCountry && selectedLeague && selectedSeason && (
        <div>
          <h2>Selected League:</h2>
          <div>
            <p>Name: {selectedLeague.name}</p>
          </div>
          <h2>Selected Season:</h2>
          <div>
            <p>Year: {selectedSeason}</p>
          </div>
          {teams.length > 0 && (
            <div>
              <h2>Teams:</h2>
              <ul>
                {teams.map((team) => (
                  <li key={team.team.id}>{team.team.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParametersPage;
