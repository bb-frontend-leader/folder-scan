import { OvaEntity } from "../entities/ova.entity";

export abstract class OvaRepository {
    /**
     * Upsert por `ova.ovaPath.local`: si ya existe una OVA con esa ruta,
     * reemplaza la entrada completa (preservando el `id` que traiga `ova`);
     * si no existe, la inserta. Delegado 1:1 al datasource subyacente.
     */
    abstract save(ova: OvaEntity): Promise<void>;
    abstract get(): Promise<OvaEntity[]>;
}