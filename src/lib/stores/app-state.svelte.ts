import type { CSVDataset, MapSettings, DatasetStyling } from "$lib/types/app";

class AppState {
  datasets = $state<CSVDataset[]>([]);
  mapSettings = $state<MapSettings>({
    styleUrl: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    minZoom: 0,
    maxZoom: 22,
    enableControls: true,
    initialCenter: [0, 0],
    initialZoom: 2,
  });

  // Derived state
  hasDatasets = $derived(this.datasets.length > 0);
  allDatasetsValid = $derived(
    this.datasets.length > 0 &&
      this.datasets.every(
        (ds) => ds.validationErrors.length === 0 && ds.geojson !== null
      )
  );

  addDataset(dataset: CSVDataset) {
    this.datasets = [...this.datasets, dataset];
  }

  removeDataset(id: string) {
    this.datasets = this.datasets.filter((ds) => ds.id !== id);
  }

  updateDatasetStyling(id: string, styling: Partial<DatasetStyling>) {
    this.datasets = this.datasets.map((ds) =>
      ds.id === id ? { ...ds, styling: { ...ds.styling, ...styling } } : ds
    );
  }

  updateMapSettings(settings: Partial<MapSettings>) {
    this.mapSettings = { ...this.mapSettings, ...settings };
  }
}

export const appState = new AppState();
