import Database from 'better-sqlite3'
import fs from 'node:fs'

import { envs } from '../../config/plugins/envs.plugin';
import { OvaDataSource } from "../../domain/datasources/ova.datasource";
import { OvaEntity } from "../../domain/entities/ova.entity";

interface OvaRow {
    id: string;
    name: string;
    cover_path: string;
    ova_path_server: string;
    ova_path_local: string;
    has_audio: number;
    has_audio_description: number;
    has_video: number;
    has_subtitles: number;
    has_video_sign_language: number;
    parent_folder: string;
    content_signature: string;
}

export class SqliteOvaDataSource implements OvaDataSource {

    private readonly db: Database.Database;

    constructor() {
        if (!fs.existsSync(envs.DATA_STORAGE_URL)) {
            fs.mkdirSync(envs.DATA_STORAGE_URL, { recursive: true });
        }

        this.db = new Database(`${envs.DATA_STORAGE_URL}/${envs.DB_STORAGE_FILE}`);
        this.db.pragma('journal_mode = WAL');

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ovas (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                cover_path TEXT NOT NULL,
                ova_path_server TEXT NOT NULL,
                ova_path_local TEXT NOT NULL UNIQUE,
                has_audio INTEGER NOT NULL,
                has_audio_description INTEGER NOT NULL,
                has_video INTEGER NOT NULL,
                has_subtitles INTEGER NOT NULL,
                has_video_sign_language INTEGER NOT NULL,
                parent_folder TEXT NOT NULL,
                content_signature TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_ovas_parent_folder ON ovas(parent_folder);
        `);
    }

    public async save(ova: OvaEntity): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ovas (
                    id, name, cover_path, ova_path_server, ova_path_local,
                    has_audio, has_audio_description, has_video, has_subtitles, has_video_sign_language,
                    parent_folder, content_signature
                ) VALUES (
                    @id, @name, @coverPath, @ovaPathServer, @ovaPathLocal,
                    @hasAudio, @hasAudioDescription, @hasVideo, @hasSubtitles, @hasVideoSignLanguage,
                    @parentFolder, @contentSignature
                )
                ON CONFLICT(ova_path_local) DO UPDATE SET
                    id = excluded.id,
                    name = excluded.name,
                    cover_path = excluded.cover_path,
                    ova_path_server = excluded.ova_path_server,
                    has_audio = excluded.has_audio,
                    has_audio_description = excluded.has_audio_description,
                    has_video = excluded.has_video,
                    has_subtitles = excluded.has_subtitles,
                    has_video_sign_language = excluded.has_video_sign_language,
                    parent_folder = excluded.parent_folder,
                    content_signature = excluded.content_signature
            `);

            stmt.run({
                id: ova.id,
                name: ova.name,
                coverPath: ova.coverPath,
                ovaPathServer: ova.ovaPath.server,
                ovaPathLocal: ova.ovaPath.local,
                hasAudio: ova.hasAudio ? 1 : 0,
                hasAudioDescription: ova.hasAudioDescription ? 1 : 0,
                hasVideo: ova.hasVideo ? 1 : 0,
                hasSubtitles: ova.hasSubtitles ? 1 : 0,
                hasVideoSignLanguage: ova.hasVideoSignLanguage ? 1 : 0,
                parentFolder: ova.parentFolder,
                contentSignature: ova.contentSignature,
            });
        } catch (error) {
            console.error('Error saving OVA:', error);
        }
    }

    public async get(): Promise<OvaEntity[]> {
        try {
            const rows = this.db.prepare('SELECT * FROM ovas').all() as OvaRow[];

            return rows.map(row => new OvaEntity({
                id: row.id,
                name: row.name,
                coverPath: row.cover_path,
                ovaPath: {
                    server: row.ova_path_server,
                    local: row.ova_path_local,
                },
                hasAudio: !!row.has_audio,
                hasAudioDescription: !!row.has_audio_description,
                hasVideo: !!row.has_video,
                hasSubtitles: !!row.has_subtitles,
                hasVideoSignLanguage: !!row.has_video_sign_language,
                parentFolder: row.parent_folder,
                contentSignature: row.content_signature,
            }));
        } catch (error) {
            console.error('Error reading OVA:', error);
            return [];
        }
    }
}
