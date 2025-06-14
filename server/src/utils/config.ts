import dotenv from 'dotenv'
import { LocalEventSource } from '../controllers/LocalEventSource.js';
import { JapancheapoEventSource } from '../controllers/JapancheapoEventSource.js';
import { TokyocheapoEventSource } from '../controllers/TokyocheapoEventSource.js';
import { DefaultEventSource } from '../controllers/DefaultEventSource.js';
import { AllsportdbEventSource } from '../controllers/AllsportdbEventSource.js';
import { MeetupEventSource } from '../controllers/MeetupEventSource.js';
import { ES_SEARCH_IN_CACHE } from '../models/Event.js';
import { EventSourceConfigType, languageEnum } from '../models/EventSource.js';
import { JapanconcertticketsEventSource } from '../controllers/JapanconcertticketsEventSource.js';
import { ArisugawaParkEventSource } from '../controllers/ArisugawaParkEventSource.js';
import { geocodingTypeEnum } from '../models/Model.js';

dotenv.config()

interface Config {
    port: number;
    nodeEnv: string;
    backupSchedule: string;
    backupTarget: string;
    mediaStoragePath: string;
    sources: Array<EventSourceConfigType>;
}

let _source: Array<EventSourceConfigType> = [
    {
        id: "default",
        enabled: false,
        endpoint: "https://ceciestundefaut.com/",
        controller: new DefaultEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "allsportdb",
        enabled: true,
        endpoint: "https://api.allsportdb.com/v3",
        controller: new AllsportdbEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "meetup",
        enabled: false,
        endpoint: "https://meetup.brol/xxxx",
        controller: new MeetupEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "local",
        enabled: false,
        endpoint: "file:///data/dummy.json",
        controller: new LocalEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "japancheapo",
        enabled: true,
        endpoint: "https://japancheapo.com/events",
        controller: new JapancheapoEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: 'japan',
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "tokyocheapo",
        enabled: true,
        endpoint: "https://tokyocheapo.com/events",
        controller: new TokyocheapoEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: 'japan',
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "japanconcerttickets",
        enabled: true,
        endpoint: "https://www.japanconcerttickets.com/wp-admin/admin-ajax.php",
        controller: new JapanconcertticketsEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "japan",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP,
    },
    {
        id: "arisugawapark",
        enabled: true,
        endpoint: "https://minato-park.jp/",
        controller: new ArisugawaParkEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "japan",
        contentLanguage: languageEnum.JP,
        geocodingLookupType: geocodingTypeEnum.STATICMAP,
        geocodingStaticMap: {
            "その他": [35.6431655,139.7406811],
            "三河台公園六本木西公園六本木三丁目児童遊園": [35.6627876,139.7302281],
            "六本木西公園": [35.6633551,139.7272584],
            "共通": [35.673673,139.726325],
            "共通その他": [35.673673,139.726325],
            "共通南桜公園": [35.6663773,139.7501446],
            "共通桜田公園": [35.6654333,139.7541748],
            "共通港区立芝公園": [35.6555626,139.7491112],
            "南桜公園": [35.6663773,139.7501446],
            "新広尾公園古川橋児童遊園中": [35.6465089,139.7328963],
            "有栖川宮記念公園": [35.6520827,139.7257986],
            "本芝公園": [35.6470459,139.7474054],
            "東麻布児童遊園その他": [35.6579026,139.7443906],
            "桜田公園": [35.6654333,139.7541748],
            "港区立芝公園": [35.6555626,139.7465363],
            "狸穴公園一の橋公": [35.6581285,139.73641],
            "飯倉公園": [35.6557099,139.7412842],
            "飯倉公園中ノ橋児童遊園": [35.6557099,139.7412842]
        }
    }
]

// paths are relative to SERVER folder
const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source,
    backupSchedule: "0 22 * * *",
    // sql:table or file:folder
    // in all case, the latest file or record will be restored at startup
    // backupTarget: "file:../backups",
    backupTarget: "sql:backups",
    mediaStoragePath: process.env.MEDIA_STORAGE_PATH || "../media"
}

// some sanity checks
if (config.backupTarget.endsWith('/')) {
    config.backupTarget = 
        config.backupTarget.substring(0, config.backupTarget.length - 1);
}

export default config;
