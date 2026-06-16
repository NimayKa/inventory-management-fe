import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

export function SearchBar({ placeholder = "Search items, categories..." }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchExecute = (e) => {
    if (e) e.preventDefault(); 
    
    if (query.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="w-full px-6 py-4 ">
      <form onSubmit={handleSearchExecute} className="w-full max-w-lg flex gap-2">
        <TextInput
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          radius="md"
          size="sm"
          leftSection={
            <FontAwesomeIcon icon="magnifying-glass" className="text-gray-400 w-4 h-4" />
          }
          className="flex-1"
        />
        <Button 
          type="submit" 
          color="cyan" 
          radius="md"
          size="sm"
        >
          Search
        </Button>
      </form>
    </header>
  );
}