import { OvaEntity } from "../entities/ova.entity";

export abstract class OvaDataSource {
       abstract save(ova: OvaEntity): Promise<void>;
       abstract get(): Promise<OvaEntity[]>;
}