import { OvaDataSource } from '@domain/datasources/ova.datasource';
import { OvaEntity } from '@domain/entities/ova.entity';
import { OvaRepository } from '@domain/repository/ova.repository';


export class OvaRepositoryImpl implements OvaRepository {
    constructor(
        private readonly OvasDataSource: OvaDataSource,
    ) {}

    public async save(ova: OvaEntity): Promise<void> {
        this.OvasDataSource.save(ova);
    }

    public async get(): Promise<OvaEntity[]> {
        return this.OvasDataSource.get();
    }
}