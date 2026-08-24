import { useCallback, useEffect, useState } from "react";

import { importLibrary } from "@googlemaps/js-api-loader";

export const useAutocompleteSuggestion = () => {
  const [token, setToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  useEffect(() => {
    const load = async () => {
      const { AutocompleteSessionToken } = await importLibrary("places");
      setToken(new AutocompleteSessionToken());
    };

    load();
  }, []);

  const fetchAutocompleteSuggestions = useCallback(
    async (inputValue: string) => {
      if (!inputValue || !token) return [];

      const { AutocompleteSuggestion } = await importLibrary("places");

      const request: google.maps.places.AutocompleteRequest = {
        input: inputValue,
        language: "pt-BR",
        region: "br",
        sessionToken: token,
      };

      const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      return suggestions;
    },
    [token],
  );

  return { fetchAutocompleteSuggestions };
};
