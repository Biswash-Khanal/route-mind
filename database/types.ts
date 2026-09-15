import { UUID } from "crypto";
import { Generated } from "kysely";

export interface Database {
    stops:StopsTable;
    routes:RoutesTable;
    route_stops:RouteStopsTable;
    route_shape_points:RouteShapePointsTable;
}



interface StopsTable{
    id:UUID;
    name:string;
    latitude:number;
    longitude:number;
    created_at:Generated<string>
    updated_at:Generated<string>
}
interface RoutesTable{
    id:UUID;
    name:string;
    operator:string;
    fare:number;
    created_at:Generated<string>
    updated_at:Generated<string>
}
interface RouteStopsTable{
    id:UUID;
    route_id:UUID;
    stop_id:UUID;
    sequence:number;
    created_at:Generated<string>
    updated_at:Generated<string>
    
}
interface RouteShapePointsTable{
    id:UUID;
    route_id:UUID;
    sequence:number;
    latitude:number;
    longitude:number;
    created_at:Generated<string>
    updated_at:Generated<string>
}
