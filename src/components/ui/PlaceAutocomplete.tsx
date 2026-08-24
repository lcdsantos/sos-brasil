"use client";

import {
  Combobox,
  HStack,
  Portal,
  Span,
  Spinner,
  useListCollection,
} from "@chakra-ui/react";
import { useAsync } from "react-use";

import { useAutocompleteSuggestion } from "@/hooks/useAutocompleteSuggestion";

import { Field } from "../admin/ui";

type PlaceAutocompleteProps = {
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlacePrediction["placeId"]) => void;
};

export const PlaceAutocomplete = ({
  inputValue,
  onPlaceSelect,
  onInputValueChange,
}: PlaceAutocompleteProps) => {
  const { fetchAutocompleteSuggestions } = useAutocompleteSuggestion();

  const { collection, set } =
    useListCollection<google.maps.places.AutocompleteSuggestion>({
      initialItems: [],
      itemToString: (item) => String(item.placePrediction?.text.text),
      itemToValue: (item) => String(item.placePrediction?.placeId),
    });

  const state = useAsync(async () => {
    const results = await fetchAutocompleteSuggestions(inputValue);
    set(results);
  }, [inputValue, set]);

  return (
    <Field label="Endereço" required>
      <Combobox.Root
        collection={collection}
        inputValue={inputValue}
        onInputValueChange={(e) => onInputValueChange(e.inputValue)}
        onSelect={(placeId) => onPlaceSelect(placeId.itemValue)}
      >
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content minW="sm">
              {state.loading ? (
                <HStack p="2">
                  <Spinner size="xs" borderWidth="1px" />
                  <Span>Carregando...</Span>
                </HStack>
              ) : state.error ? (
                <Span p="2" color="fg.error">
                  Error fetching
                </Span>
              ) : (
                collection.items?.map((autocompleteSuggestion) => (
                  <Combobox.Item
                    key={autocompleteSuggestion.placePrediction?.placeId}
                    item={autocompleteSuggestion}
                  >
                    {autocompleteSuggestion.placePrediction?.text.text}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))
              )}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Field>
  );
};
