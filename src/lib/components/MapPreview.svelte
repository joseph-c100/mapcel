<script lang="ts">
  import { onMount } from "svelte";
  import maplibregl from "maplibre-gl";
  import type { Map as MaplibreMap, LngLatBoundsLike } from "maplibre-gl";
  import { appState } from "$lib/stores/app-state.svelte";

  let mapContainer: HTMLDivElement;
  let map: MaplibreMap | null = $state(null);
  let isMapLoaded = $state(false);
  let currentStyleUrl = $state("");

  onMount(() => {
    // Initialize map
    map = new maplibregl.Map({
      container: mapContainer,
      style: appState.mapSettings.styleUrl,
      center: appState.mapSettings.initialCenter,
      zoom: appState.mapSettings.initialZoom,
      minZoom: appState.mapSettings.minZoom,
      maxZoom: appState.mapSettings.maxZoom,
    });

    currentStyleUrl = appState.mapSettings.styleUrl;

    if (appState.mapSettings.enableControls) {
      map.addControl(new maplibregl.NavigationControl());
    }

    map.on("load", () => {
      isMapLoaded = true;
    });

    return () => {
      map?.remove();
    };
  });

  // Update map when datasets or settings change
  $effect(() => {
    if (!map || !isMapLoaded) return;

    // Remove all existing layers and sources
    const existingLayers = map.getStyle().layers || [];
    existingLayers.forEach((layer) => {
      if (layer.id.startsWith("dataset-")) {
        map!.removeLayer(layer.id);
      }
    });

    const existingSources = Object.keys(map.getStyle().sources);
    existingSources.forEach((sourceId) => {
      if (sourceId.startsWith("dataset-")) {
        map!.removeSource(sourceId);
      }
    });

    // Add new sources and layers for valid datasets
    const validDatasets = appState.datasets.filter(
      (ds) => ds.geojson && ds.validationErrors.length === 0
    );

    validDatasets.forEach((dataset, index) => {
      const sourceId = `dataset-${index}`;
      const layerId = `dataset-${index}-circles`;

      map!.addSource(sourceId, {
        type: "geojson",
        data: dataset.geojson!,
      });

      map!.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": dataset.styling.radius,
          "circle-color": dataset.styling.color,
          "circle-opacity": dataset.styling.opacity,
        },
      });
    });

    // Fit bounds to show all features
    if (validDatasets.length > 0) {
      const allFeatures = validDatasets.flatMap(
        (ds) => ds.geojson?.features || []
      );
      const pointFeatures = allFeatures.filter(
        (f): f is import("geojson").Feature<import("geojson").Point> =>
          f.geometry.type === "Point"
      );

      if (pointFeatures.length > 0) {
        const firstCoords = pointFeatures[0].geometry.coordinates as [
          number,
          number,
        ];
        const bounds = pointFeatures.reduce(
          (bounds, feature) => {
            return bounds.extend(
              feature.geometry.coordinates as [number, number]
            );
          },
          new maplibregl.LngLatBounds(firstCoords, firstCoords)
        );

        map.fitBounds(bounds as LngLatBoundsLike, {
          padding: 50,
          maxZoom: 15,
        });
      }
    }
  });

  // Update map style when style URL changes
  $effect(() => {
    if (!map || !isMapLoaded) return;

    // Only update style if URL actually changed
    if (appState.mapSettings.styleUrl !== currentStyleUrl) {
      currentStyleUrl = appState.mapSettings.styleUrl;

      try {
        map.setStyle(appState.mapSettings.styleUrl);

        // Re-add layers after style loads
        map.once("style.load", () => {
          isMapLoaded = true;
        });
      } catch (error) {
        console.error("Error setting map style:", error);
      }
    }
  });

  // Update zoom constraints
  $effect(() => {
    if (!map) return;

    map.setMinZoom(appState.mapSettings.minZoom);
    map.setMaxZoom(appState.mapSettings.maxZoom);
  });
</script>

<div class="map-preview">
  {#if !appState.hasDatasets}
    <div class="empty-state">
      <p>Upload and configure datasets to see the map preview</p>
    </div>
  {:else if !appState.allDatasetsValid}
    <div class="warning-state">
      <p>
        ⚠️ Some datasets have validation errors. Fix them to see the preview.
      </p>
    </div>
  {/if}

  <div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
  .map-preview {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    background: #f5f5f5;
  }

  .map-container {
    width: 100%;
    height: 100%;
  }

  .empty-state,
  .warning-state {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
    z-index: 1;
    pointer-events: none;
  }

  .empty-state p {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }

  .warning-state {
    background: rgba(255, 245, 230, 0.95);
  }

  .warning-state p {
    color: #cc8800;
    font-weight: 500;
    text-align: center;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .map-preview {
      height: 400px;
    }
  }
</style>
