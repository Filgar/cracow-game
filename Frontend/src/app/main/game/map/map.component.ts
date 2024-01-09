import { Component } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Projection, fromLonLat, toLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';
import {get as getProjection} from 'ol/proj.js';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Circle, Fill, Stroke, Style} from 'ol/style.js';
import { GameService } from '../../../services/game.service';
import { Geometry, LineString, MultiLineString, MultiPoint, Polygon } from 'ol/geom';
import { GeomModel } from '../../../models/UrbanObject';
import * as olSphere from 'ol/sphere';
import Overlay from 'ol/Overlay';

const PROJECTION = "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
const CRACOW_CENTER_LONLAT = [20.004790, 50.046966];
const CIRCLE_RADIUS = 7;
const LINESTRING_WIDTH = 5;
const LINESTRING_RESULT_WIDTH = 3;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  constructor(private readonly gameService: GameService) {}

  public map!: Map;
  private selectedPoint: Coordinate = [];
  private targetObject: Feature | null = null;
  private preventSelection: boolean = false;

  ngOnInit(): void {
    this.setupMap();
    
    this.gameService.selectionConfirmed$.subscribe((urbanObject) => {
      this.targetObject = this.getFeatureFromGeom(urbanObject.geom);
      this.showObject(this.targetObject, this.getObjectStyle(urbanObject.geom, 'orange'), false);
      const closestPoint = this.targetObject?.getGeometry()?.getClosestPoint(this.selectedPoint)!;
      if (!closestPoint) {
        return;
      }
      this.showMapResults(closestPoint);
      this.gameService.calculateScore(this.distanceToSelected);
    });

    this.gameService.clearMap$.subscribe(() => {
      this.clearMap();
      this.preventSelection = false;
    });
  }

  private setupMap(): void {
    proj4.defs('2178', PROJECTION);
    register(proj4)

    const projection = getProjection('2178')!;
    const center = fromLonLat(CRACOW_CENTER_LONLAT, projection);

    this.map = this.createMap(projection, center);
    this.map.getLayers().getArray()[0].set('isBasemap', true);
    this.createMapExtent(projection, center);

    this.map.on('click', (event) => {
      if (this.preventSelection) {
        return;
      }

      this.selectedPoint = event.coordinate;
      const geom = {type: 'Point', coordinates: event.coordinate};
      this.showObject(this.getFeatureFromGeom(geom), this.getObjectStyle(geom, 'purple'), true);
    });
  }

  private createMap(projection: Projection, center: Coordinate): Map {
    return new Map({
      view: new View({
        center: center,
        zoom: 12.5,
        projection: projection,
      }),
      layers: [
        new TileLayer({
          opacity: 1,
          source: new XYZ({
            urls:['https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png'],
            attributions: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>']
          }),
        }),
      ],
      target: 'ol-map'
    });
  }

  private createMapExtent(projection: Projection, center: Coordinate): void {
    this.map.setView(
      new View({
          center: center,
          extent: this.map.getView().calculateExtent(this.map.getSize()?.map(x => x * 1.5)),   
          zoom: 12.5,
          projection: projection,
        })
      );
  }

  private showObject(feature: Feature, style: Style, userEvent: boolean, zoomToLayer: boolean = false): void {
    if (!this.gameService.isPlaying$.value) {
      return;
    }
    if (userEvent && this.map.getLayers().getLength() > 1) {
      this.clearMap();
    }
    const source =  new VectorSource({
      features: [feature]
    });

    this.map.addLayer(new VectorLayer({
      source: source,
      style: style
    }));

    if (userEvent) {
      this.gameService.pointSelected$.next(true);
    }
    if (zoomToLayer) {
      this.map.getView().fit(source.getExtent()!, {padding: [150, 100, 100, 100], duration: 500});
    }
  }
  
    private clearMap(): void {
      const layers = this.map.getLayers().getArray().filter((layer) => layer.get('isBasemap') !== true);
      layers.forEach(layer => {
        this.map.removeLayer(layer);
      });

      const overlays = this.map.getOverlays().getArray();
      overlays.forEach(overlay => {
        this.map.removeOverlay(overlay);
      });
      this.gameService.pointSelected$.next(false);
      this.selectedPoint = [];
      this.targetObject = null;
    }

    private showDistanceTooltip(coords: Coordinate) {
      const tooltip = document.createElement('div');
      tooltip.id = 'distance-tooltip';
      tooltip.style.display = 'block';
      tooltip.innerHTML = this.distanceToSelected.toFixed(2) + ' m';
      this.map.addOverlay(new Overlay({
        element: tooltip,
        offset: [0, -25],
        position: coords
      }));
    }

    private showMapResults(closestPoint: Coordinate): void {
      this.preventSelection = true;
      const resultStyle = new Style(({
        stroke: new Stroke({
          color: 'lightblue',
          width: LINESTRING_RESULT_WIDTH,
          lineDash: [3, 5]
        })
      })); 
      const distanceFeature = this.getFeatureFromGeom({type: 'LineString', coordinates: [this.selectedPoint, closestPoint]});
      this.showObject(distanceFeature, resultStyle, false, true);
      this.showDistanceTooltip([(closestPoint[0] + this.selectedPoint[0]) / 2, (closestPoint[1] + this.selectedPoint[1]) / 2]);
    }

    private getFeatureFromGeom(geom: GeomModel): Feature {
      switch(geom.type) {
        case 'Point':
          return new Feature({geometry: new Point(geom.coordinates as Coordinate)});
        case 'MultiPoint':
          return new Feature({geometry: new MultiPoint(geom.coordinates as Coordinate[])});
        case 'LineString':
          return new Feature({geometry: new LineString(geom.coordinates as Coordinate[])});
        case 'MultiLineString':
          return new Feature({geometry: new MultiLineString(geom.coordinates as Coordinate[][] )});
        case 'Polygon':
          return new Feature({geometry: new Polygon(geom.coordinates as Coordinate[][])});
        default:
          throw new Error('Unsupported geometry type');
      }
    }
  
    private getObjectStyle(geom: GeomModel, color: string): Style {
      switch(geom.type) {
        case 'Point':
          return new Style({image: new Circle({radius: CIRCLE_RADIUS, stroke: new Stroke({color: color})})});
        case 'MultiPoint':
          return new Style({image: new Circle({radius: CIRCLE_RADIUS, stroke: new Stroke({color: color})})});
        case 'LineString':
          return new Style({stroke: new Stroke({color: color, width: LINESTRING_WIDTH})});
        case 'MultiLineString':
          return new Style({stroke: new Stroke({color: color, width: LINESTRING_WIDTH})});
        case 'Polygon':
          return new Style({fill: new Fill({color: color})});
        default:
          throw new Error('Unsupported geometry type');
      }
    }

    get distanceToSelected(): number {
      const closestPoint = this.targetObject?.getGeometry()?.getClosestPoint(this.selectedPoint);
      return !!closestPoint ? olSphere.getDistance(toLonLat(closestPoint, '2178'), toLonLat(this.selectedPoint, '2178')) : -1;
  }
}