import { OvaEntity } from "../entities/ova.entity";

export abstract class OvaDataSource {
       /**
        * Upsert por `ova.ovaPath.local`: si ya existe una OVA con esa ruta,
        * reemplaza la entrada completa (preservando el `id` que traiga `ova`);
        * si no existe, la inserta. Toda implementación (JSON, SQLite, etc.)
        * debe cumplir esta semántica para que ScanFolder funcione igual sin
        * importar el backend.
        */
       abstract save(ova: OvaEntity): Promise<void>;
       abstract get(): Promise<OvaEntity[]>;
}