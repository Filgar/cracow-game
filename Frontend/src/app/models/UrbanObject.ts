import { UrbanObjectType } from "./UrbanObjectType";
import { Coordinate } from 'ol/coordinate';

export interface UrbanObject {
    id: number;
    name: string;
    type: UrbanObjectType;
    geom: GeomModel;
    district: number;
}

export interface GeomModel {
    type: string,
    coordinates: Coordinate | Coordinate[] | Coordinate[][]
}