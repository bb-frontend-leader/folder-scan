import { OvaEntity } from "@domain/entities/ova.entity";

export abstract class OvaRepository {
    abstract save(ova: OvaEntity): Promise<void>;
    abstract get(): Promise<OvaEntity[]>;
}