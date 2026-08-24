"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";

import { Flex } from "@chakra-ui/react";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

type MapProps = {
  places?: { id: string | null; content: string | null }[];
};

type Marker = {
  key: string;
  position: google.maps.LatLng | null | undefined;
  headerContent: ReactNode;
  content: ReactNode;
};

export const MapContainer = ({ places }: MapProps) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      region="br"
      language="pt-BR"
    >
      <Flex flex={1} alignItems="stretch">
        <MapElement places={places} />
      </Flex>
    </APIProvider>
  );
};

const MapMarker = ({ position, headerContent, content }: Marker) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    [],
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        <Pin />
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onClose={handleClose}
          headerContent={headerContent}
        >
          {content}
        </InfoWindow>
      )}
    </>
  );
};

const MapElement = ({ places }: MapProps) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    if (!placesLib || !map) return;

    const bounds = new google.maps.LatLngBounds();

    if (Array.isArray(places) && places.length > 0) {
      places.map(({ id, content }) => {
        if (id) {
          const place = new placesLib.Place({ id });

          place
            .fetchFields({ fields: ["displayName", "location"] })
            .then((response) => {
              if (response.place.location) {
                bounds.extend(response.place.location);
                map.fitBounds(bounds);
                setMarkers((markers) => {
                  if (markers.find((m) => m.key === place.id)) {
                    return markers;
                  }

                  return [
                    ...markers,
                    {
                      key: place.id,
                      position: place.location,
                      headerContent: place.displayName,
                      content: (
                        <>
                          <strong>Motivo:</strong> {content}
                        </>
                      ),
                    },
                  ];
                });
              }
            });
        }
      });
    }
  }, [placesLib, map, places]);

  return (
    <Map
      mapId="41c841e2d7246c8cbae2bd03"
      defaultZoom={4}
      defaultCenter={{ lat: -14.235004, lng: -51.92528 }}
      style={{ height: "auto" }}
    >
      {markers.map(({ key, ...marker }) => (
        <MapMarker key={key} {...marker} />
      ))}
    </Map>
  );
};
