import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ParametersPageProps {
  apiKey: string;
}

interface Country {
  name: string;
  code: string;
}

const ParametersPage: React.FC<ParametersPageProps> = ({ apiKey }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const config = {
          method: 'get',
          url: 'https://v3.football.api-sports.io/countries',
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        };

        const response = await axios(config);
        console.log(response.data);
        setCountries(response.data.response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
  }, [apiKey]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;
    const selected = countries.find((country) => country.code === countryCode);
    setSelectedCountry(selected || null);
  };

  return (
    <div>
      <h2>Account:</h2>
      {/* Account details */}

      <h2>Select Country:</h2>
      <div>
        <select
          className="form-select"
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
          <h2>Selected Country:</h2>
          <div>
            <p>Name: {selectedCountry.name}</p>
            <p>Code: {selectedCountry.code}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParametersPage;
